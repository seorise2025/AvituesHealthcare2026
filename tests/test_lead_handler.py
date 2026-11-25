"""
Lead handler tests. Run from the repo root:

    python3 -m unittest discover -s tests -v
"""
import json
import os
import sqlite3
import sys
import tempfile
import threading
import time
import unittest
import urllib.error
import urllib.parse
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "server"))
sys.path.insert(0, HERE)

import lead_handler as lh  # noqa: E402
from sinks import SMTPSink, WebhookSink  # noqa: E402

ORIGIN = "https://aviteushealthcare.co.uk"


def employer(**over):
    d = {"lead_type": "employer", "urgency": "urgent", "roles": ["RGN", "HCA"], "name": "Sam Taylor",
         "organisation": "Oak House Care Home", "phone": "020 7946 0018", "email": "sam@oakhouse.example",
         "postcode": "ha3 8dd", "setting": "Nursing home", "notes": "Nights from Friday",
         "page_url": "/request-staff/", "referrer": "https://www.google.com/", "form_ts": str((time.time() - 30) * 1000),
         "website": ""}
    d.update(over)
    return d


class Base(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.mkdtemp()
        self.smtp = SMTPSink()
        self.hook = WebhookSink()
        env = {
            "LEAD_DB_PATH": os.path.join(self.tmp, "leads.db"),
            "LEAD_TO_EMPLOYER": "bookings@test.example", "LEAD_TO_CANDIDATE": "recruit@test.example",
            "LEAD_TO_GENERAL": "info@test.example", "MAIL_FROM": "no-reply@test.example",
            "SMTP_HOST": "127.0.0.1", "SMTP_PORT": str(self.smtp.port), "SMTP_STARTTLS": "false",
            "CRM_WEBHOOK_URL": self.hook.url, "CRM_WEBHOOK_TOKEN": "test-token",
            "ALLOWED_ORIGINS": ORIGIN, "RATE_LIMIT": "50", "MIN_FILL_SECONDS": "3",
            "DELIVERY_TIMEOUT_SECONDS": "3", "TRUST_PROXY": "true",
        }
        self.old_env = {k: os.environ.get(k) for k in env}
        os.environ.update(env)
        self.settings = lh.Settings()
        self.srv = lh.make_server(self.settings, "127.0.0.1", 0)
        self.port = self.srv.server_address[1]
        threading.Thread(target=self.srv.serve_forever, daemon=True).start()

    def tearDown(self):
        self.srv.shutdown()
        self.srv.server_close()
        self.smtp.stop()
        self.hook.stop()
        for k, v in self.old_env.items():
            if v is None:
                os.environ.pop(k, None)
            else:
                os.environ[k] = v

    def post(self, data, json_accept=True, origin=ORIGIN, ctype="application/x-www-form-urlencoded", ip="203.0.113.5", raw=None):
        body = raw if raw is not None else urllib.parse.urlencode(data, doseq=True).encode()
        req = urllib.request.Request(f"http://127.0.0.1:{self.port}/api/enquiry", data=body, method="POST")
        req.add_header("Content-Type", ctype)
        req.add_header("X-Real-IP", ip)
        if origin:
            req.add_header("Origin", origin)
        if json_accept:
            req.add_header("Accept", "application/json")

        class NoRedirect(urllib.request.HTTPRedirectHandler):
            def redirect_request(self, *a, **k):
                return None
        opener = urllib.request.build_opener(NoRedirect)
        try:
            r = opener.open(req, timeout=10)
            return r.status, r.headers, r.read()
        except urllib.error.HTTPError as e:
            return e.code, e.headers, e.read()

    def rows(self):
        con = sqlite3.connect(self.settings.db_path)
        con.row_factory = sqlite3.Row
        try:
            return [dict(r) for r in con.execute("SELECT * FROM leads")]
        except sqlite3.OperationalError:
            return []
        finally:
            con.close()

    def wait_for(self, cond, timeout=8):
        end = time.time() + timeout
        while time.time() < end:
            if cond():
                return True
            time.sleep(0.05)
        return False


class TestHappyPath(Base):
    def test_employer_lead_is_stored_routed_and_confirmed(self):
        code, _, body = self.post(employer())
        self.assertEqual(code, 200)
        res = json.loads(body)
        self.assertTrue(res["ok"])
        self.assertRegex(res["redirect"], r"^/thank-you/employer/\?ref=AV-\d{8}-[A-Z0-9]{5}$")
        ref = res["ref"]
        self.assertTrue(self.wait_for(lambda: len(self.smtp.messages) == 2), "expected 2 emails")
        internal = next(m for m in self.smtp.messages if m["to"] == ["bookings@test.example"])
        confirm = next(m for m in self.smtp.messages if m["to"] == ["sam@oakhouse.example"])
        self.assertIn("URGENT", internal["msg"]["Subject"])
        self.assertIn(ref, internal["msg"]["Subject"])
        self.assertEqual(internal["msg"]["Reply-To"], "sam@oakhouse.example")
        text = internal["msg"].get_payload(decode=True).decode()
        self.assertIn("Oak House Care Home", text)
        self.assertIn("RGN nurse, Healthcare assistant", text)
        self.assertIn("HA3 8DD", text)
        self.assertIn(ref, confirm["msg"]["Subject"])
        ctext = confirm["msg"].get_payload(decode=True).decode()
        self.assertIn("020 3488 8172", ctext)
        self.assertNotIn("Nights from Friday", ctext, "confirmation must not echo the full request")
        self.assertTrue(self.wait_for(lambda: len(self.hook.calls) == 1))
        call = self.hook.calls[0]
        self.assertEqual(call["headers"]["Authorization"], "Bearer test-token")
        self.assertEqual(call["json"]["ref"], ref)
        self.assertEqual(call["json"]["lead_type"], "employer")
        self.assertEqual(call["json"]["source"]["page_url"], "/request-staff/")
        self.assertTrue(self.wait_for(lambda: self.rows() and self.rows()[0]["status"] == "delivered"))
        row = self.rows()[0]
        self.assertEqual((row["email_ok"], row["crm_ok"], row["confirm_ok"]), (1, 1, 1))

    def test_candidate_and_general_route_to_their_own_inboxes(self):
        cand = {"lead_type": "candidate", "role": "HCA", "name": "Ade Bello", "phone": "07700 900123",
                "email": "ade@example.com", "postcode": "HA1 1AA", "experience": "1 to 3 years",
                "right_to_work": "Yes", "marketing_opt_in": "yes"}
        gen = {"lead_type": "general", "name": "Pat", "email": "pat@example.com", "topic": "Invoice", "message": "Hello"}
        self.assertEqual(self.post(cand)[0], 200)
        self.assertEqual(self.post(gen)[0], 200)
        self.assertTrue(self.wait_for(lambda: len(self.smtp.messages) == 4))
        to = sorted(m["to"][0] for m in self.smtp.messages)
        self.assertEqual(to, sorted(["recruit@test.example", "ade@example.com", "info@test.example", "pat@example.com"]))
        crow = next(r for r in self.rows() if r["form_type"] == "candidate")
        self.assertEqual(crow["marketing_opt_in"], 1)
        self.assertIn("job alerts", crow["marketing_wording"])

    def test_without_javascript_the_browser_is_redirected(self):
        code, headers, _ = self.post(employer(), json_accept=False)
        self.assertEqual(code, 303)
        self.assertRegex(headers["Location"], r"^/thank-you/employer/\?ref=AV-")
        code, headers, _ = self.post(employer(email="bad"), json_accept=False)
        self.assertEqual(code, 303)
        self.assertTrue(headers["Location"].startswith("/enquiry-problem/?reason=invalid"))


class TestValidation(Base):
    def test_missing_and_bad_fields_return_field_errors(self):
        code, _, body = self.post({"lead_type": "employer", "email": "not-an-email", "postcode": "12345",
                                   "phone": "abc", "urgency": "whenever"})
        self.assertEqual(code, 400)
        errs = json.loads(body)["errors"]
        for f in ("name", "organisation", "email", "postcode", "phone", "urgency"):
            self.assertIn(f, errs)
        self.assertEqual(self.rows(), [])

    def test_unknown_choice_and_overlong_text_are_rejected(self):
        code, _, body = self.post(employer(roles=["Surgeon"], notes="x" * 2500))
        errs = json.loads(body)["errors"]
        self.assertEqual(code, 400)
        self.assertIn("roles", errs)
        self.assertIn("notes", errs)

    def test_header_injection_is_neutralised(self):
        code, _, _ = self.post(employer(organisation="Evil\r\nBcc: victim@example.com", name="A\nB"))
        self.assertEqual(code, 200)
        self.assertTrue(self.wait_for(lambda: len(self.smtp.messages) == 2))
        for m in self.smtp.messages:
            self.assertNotIn("victim@example.com", m["to"])
            self.assertNotIn("\n", m["msg"]["Subject"])
            self.assertIsNone(m["msg"]["Bcc"])


class TestAbuse(Base):
    def test_honeypot_pretends_success_and_stores_nothing(self):
        code, _, body = self.post(employer(website="http://spam.example"))
        self.assertEqual(code, 200)
        self.assertTrue(json.loads(body)["ok"])
        time.sleep(0.3)
        self.assertEqual(self.rows(), [])
        self.assertEqual(self.smtp.messages, [])

    def test_too_fast_submission_is_dropped(self):
        self.post(employer(form_ts=str(time.time() * 1000)))
        time.sleep(0.3)
        self.assertEqual(self.rows(), [])

    def test_wrong_origin_type_and_size(self):
        self.assertEqual(self.post(employer(), origin="https://evil.example")[0], 403)
        self.assertEqual(self.post(employer(), ctype="application/json")[0], 415)
        self.assertEqual(self.post(None, raw=b"a=" + b"x" * 30000)[0], 413)
        self.assertEqual(self.post({"lead_type": "nope"})[0], 400)

    def test_rate_limit_per_ip(self):
        os.environ["RATE_LIMIT"] = "3"
        self.srv.shutdown()
        self.srv.server_close()
        self.settings = lh.Settings()
        self.srv = lh.make_server(self.settings, "127.0.0.1", 0)
        self.port = self.srv.server_address[1]
        threading.Thread(target=self.srv.serve_forever, daemon=True).start()
        codes = [self.post(employer(), ip="198.51.100.9")[0] for _ in range(4)]
        self.assertEqual(codes, [200, 200, 200, 429])
        self.assertEqual(self.post(employer(), ip="198.51.100.10")[0], 200, "other visitors are not affected")


class TestFailures(Base):
    def test_email_down_keeps_lead_then_retry_delivers(self):
        self.smtp.stop()
        os.environ["SMTP_PORT"] = "1"           # nothing listening
        self.hook.fail = True
        settings = lh.Settings()
        lh.Handler.settings = settings
        code, _, body = self.post(employer())
        self.assertEqual(code, 200, "visitor still gets the thank-you page because the lead is saved")
        ref = json.loads(body)["ref"]
        self.assertTrue(self.wait_for(lambda: self.rows() and self.rows()[0]["attempts"] == 1))
        row = self.rows()[0]
        self.assertEqual(row["status"], "pending")
        self.assertEqual(row["confirm_ok"], 0, "no confirmation until the business has the lead")
        self.assertIn("email", row["last_error"])
        # Recovery
        self.smtp = SMTPSink()
        os.environ["SMTP_PORT"] = str(self.smtp.port)
        self.hook.fail = False
        n = lh.retry_pending(lh.Settings())
        self.assertEqual(n, 1)
        row = self.rows()[0]
        self.assertEqual(row["status"], "delivered")
        self.assertEqual(len(self.smtp.messages), 2)
        self.assertEqual(self.hook.calls[0]["json"]["ref"], ref)

    def test_crm_down_is_partial_and_retried_without_duplicate_emails(self):
        self.hook.fail = True
        self.post(employer())
        self.assertTrue(self.wait_for(lambda: self.rows() and self.rows()[0]["status"] == "partial"))
        self.assertEqual(len(self.smtp.messages), 2)
        self.hook.fail = False
        lh.retry_pending(self.settings)
        self.assertEqual(self.rows()[0]["status"], "delivered")
        self.assertEqual(len(self.smtp.messages), 2, "emails are not sent twice")
        self.assertEqual(len(self.hook.calls), 1)

    def test_storage_failure_tells_the_visitor(self):
        bad = os.path.join(self.tmp, "file")
        open(bad, "w").close()
        os.environ["LEAD_DB_PATH"] = os.path.join(bad, "leads.db")   # parent is a file: cannot create
        lh.Handler.settings = lh.Settings()
        code, _, body = self.post(employer())
        self.assertEqual(code, 503)
        self.assertEqual(json.loads(body)["error"], "server")
        code, headers, _ = self.post(employer(), json_accept=False)
        self.assertEqual(code, 303)
        self.assertIn("reason=server", headers["Location"])

    def test_purge_removes_old_leads(self):
        self.post(employer())
        self.wait_for(lambda: self.rows())
        con = sqlite3.connect(self.settings.db_path)
        con.execute("UPDATE leads SET created_at='2020-01-01T00:00:00+00:00'")
        con.commit()
        con.close()
        self.assertEqual(lh.purge(self.settings), 1)
        self.assertEqual(self.rows(), [])


class TestConfig(unittest.TestCase):
    def test_check_config_lists_missing_settings(self):
        keys = ["MAIL_FROM", "SMTP_HOST", "LEAD_TO_EMPLOYER", "LEAD_TO_CANDIDATE", "LEAD_TO_GENERAL", "CRM_WEBHOOK_URL"]
        saved = {k: os.environ.pop(k, None) for k in keys}
        try:
            probs = lh.Settings().problems()
            self.assertTrue(any("MAIL_FROM" in p for p in probs))
            self.assertTrue(any("SMTP_HOST" in p for p in probs))
        finally:
            for k, v in saved.items():
                if v is not None:
                    os.environ[k] = v


if __name__ == "__main__":
    unittest.main()
