#!/usr/bin/env python3
"""
Aviteus Healthcare lead handler. Python 3.10+ standard library only.

Receives the three website forms at POST /api/enquiry and:
  1. checks origin, size, spam signals and rate limits
  2. validates every field on the server (never trusts the browser)
  3. SAVES the lead to SQLite first, so nothing is lost if email or CRM fails
  4. returns the thank-you page straight away
  5. in the background: emails the right team, posts to the CRM webhook,
     and sends the visitor a plain confirmation email
  6. leads that could not be delivered stay "pending" for --retry

Run:
  python3 server/lead_handler.py                    serve on 127.0.0.1:8081
  python3 server/lead_handler.py --retry            resend pending leads (run from a timer)
  python3 server/lead_handler.py --purge            delete leads older than LEAD_RETENTION_DAYS
  python3 server/lead_handler.py --check-config     list missing settings
  STATIC_DIR=dist/preview python3 server/lead_handler.py   also serve the site (local testing only)

All settings and secrets come from environment variables. See server/lead-handler.env.example.
Never put real values in the repository.
"""
import argparse
import json
import logging
import mimetypes
import os
import re
import secrets
import smtplib
import sqlite3
import ssl
import sys
import threading
import time
import urllib.parse
import urllib.request
from collections import defaultdict, deque
from contextlib import contextmanager
from datetime import datetime, timedelta, timezone
from email.message import EmailMessage
from email.utils import formataddr, make_msgid
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

log = logging.getLogger("lead_handler")


# --------------------------------------------------------------------------- settings
def env(name, default=""):
    return os.environ.get(name, default).strip()


def env_bool(name, default):
    v = env(name, "true" if default else "false").lower()
    return v in ("1", "true", "yes", "on")


class Settings:
    def __init__(self):
        self.db_path = env("LEAD_DB_PATH", "data/leads.db")
        self.to = {
            "employer": [a for a in env("LEAD_TO_EMPLOYER").split(",") if a.strip()],
            "candidate": [a for a in env("LEAD_TO_CANDIDATE").split(",") if a.strip()],
            "general": [a for a in env("LEAD_TO_GENERAL").split(",") if a.strip()],
        }
        self.mail_from = env("MAIL_FROM")
        self.mail_from_name = env("MAIL_FROM_NAME", "Aviteus Healthcare")
        self.smtp_host = env("SMTP_HOST")
        self.smtp_port = int(env("SMTP_PORT", "587"))
        self.smtp_user = env("SMTP_USER")
        self.smtp_password = env("SMTP_PASSWORD")
        self.smtp_starttls = env_bool("SMTP_STARTTLS", True)
        self.smtp_ssl = env_bool("SMTP_SSL", False)
        self.crm_url = env("CRM_WEBHOOK_URL")
        self.crm_token = env("CRM_WEBHOOK_TOKEN")
        self.allowed_origins = [o for o in env("ALLOWED_ORIGINS", "https://aviteushealthcare.co.uk").split(",") if o]
        self.rate_limit = int(env("RATE_LIMIT", "5"))
        self.rate_window = int(env("RATE_WINDOW_SECONDS", "900"))
        self.min_fill = float(env("MIN_FILL_SECONDS", "3"))
        self.turnstile_secret = env("TURNSTILE_SECRET")
        self.send_confirmation = env_bool("SEND_CONFIRMATION", True)
        self.retention_days = int(env("LEAD_RETENTION_DAYS", "90"))
        self.phone = env("PUBLIC_PHONE", "020 3488 8172")
        self.site_url = env("SITE_URL", "https://aviteushealthcare.co.uk")
        self.trust_proxy = env_bool("TRUST_PROXY", True)
        self.static_dir = env("STATIC_DIR")
        self.timeout = float(env("DELIVERY_TIMEOUT_SECONDS", "10"))

    def problems(self):
        p = []
        if not self.mail_from:
            p.append("MAIL_FROM is not set")
        if not self.smtp_host:
            p.append("SMTP_HOST is not set (no emails will be sent)")
        for k, v in self.to.items():
            if not v and not self.crm_url:
                p.append(f"LEAD_TO_{k.upper()} is not set and there is no CRM_WEBHOOK_URL: {k} leads would only be stored")
        if self.smtp_host and not (self.smtp_starttls or self.smtp_ssl):
            p.append("SMTP has no TLS: set SMTP_STARTTLS=true or SMTP_SSL=true")
        return p


# --------------------------------------------------------------------------- form rules
UK_POSTCODE = re.compile(r"^[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}$", re.I)
EMAIL = re.compile(r"^[^@\s<>\"',;]{1,64}@[A-Za-z0-9.-]{1,253}\.[A-Za-z]{2,}$")

FORMS = {
    "employer": {
        "label": "Staff request",
        "required": ["urgency", "name", "organisation", "phone", "email", "postcode"],
        "optional": ["roles", "setting", "notes", "marketing_opt_in"],
        "choices": {
            "urgency": {"urgent": "Today or tomorrow", "temporary": "Shifts in the coming weeks", "permanent": "Permanent hire"},
            "roles": {"RGN": "RGN nurse", "RMN": "RMN nurse", "RNLD": "RNLD nurse", "Senior carer": "Senior carer",
                      "HCA": "Healthcare assistant", "Support worker": "Support worker", "Manager": "Manager or deputy"},
            "setting": {"": "", "Residential care home": "", "Nursing home": "", "Supported living": "",
                        "Learning disability service": "", "Mental health service": "", "NHS trust or hospital": "",
                        "Other": ""},
        },
        "thanks": "/thank-you/employer/",
    },
    "candidate": {
        "label": "Candidate registration",
        "required": ["role", "name", "phone", "email", "postcode", "experience", "right_to_work"],
        "optional": ["notes", "marketing_opt_in"],
        "choices": {
            "role": {"HCA": "Healthcare assistant", "Support worker": "Support worker",
                     "Senior carer": "Senior carer", "Nurse": "Registered nurse"},
            "experience": {"None yet": "", "Less than 6 months": "", "6 to 12 months": "",
                           "1 to 3 years": "", "More than 3 years": ""},
            "right_to_work": {"Yes": "", "No": "", "Not sure": ""},
        },
        "thanks": "/thank-you/candidate/",
    },
    "general": {
        "label": "Website message",
        "required": ["name", "email", "message"],
        "optional": ["topic", "phone"],
        "choices": {
            "topic": {"General question": "", "Timesheet or pay": "", "Invoice": "", "Compliance file": "",
                      "Complaint or feedback": "", "Data protection request": "", "Other": ""},
        },
        "thanks": "/thank-you/message/",
    },
}
MAX_LEN = {"name": 100, "organisation": 150, "email": 254, "phone": 30, "postcode": 10,
           "notes": 2000, "message": 3000, "setting": 60, "topic": 60}
CONTEXT = ["page_url", "referrer", "utm_source", "utm_medium", "utm_campaign"]
MESSAGES = {
    "urgency": "Choose how soon you need staff.",
    "name": "Enter your name.",
    "organisation": "Enter your organisation.",
    "phone": "Enter a UK phone number, for example 020 3488 8172.",
    "email": "Enter an email address, for example name@example.co.uk.",
    "postcode": "Enter a UK postcode, for example HA3 8DD.",
    "role": "Choose the role you want.",
    "experience": "Choose your experience.",
    "right_to_work": "Choose an answer.",
    "message": "Enter your message.",
}
MARKETING_WORDING = {
    "employer": "Send me occasional staffing updates from Aviteus Healthcare by email. I can unsubscribe at any time.",
    "candidate": "Send me new shift and job alerts by email or text. I can opt out at any time.",
}


def clean(v):
    v = v.replace("\r", " ").replace("\x00", "")
    return re.sub(r"[ \t]+", " ", v).strip()


def validate(form_type, raw):
    """Returns (data, errors). raw is a dict of lists from parse_qs."""
    spec = FORMS[form_type]
    data, errors = {}, {}
    for name in spec["required"] + spec["optional"]:
        values = [clean(v) for v in raw.get(name, []) if clean(v)]
        if name in ("roles",):
            val = values
        else:
            val = values[0] if values else ""
        if isinstance(val, str):
            if name not in ("notes", "message"):
                val = val.replace("\n", " ")
            limit = MAX_LEN.get(name, 200)
            if len(val) > limit:
                errors[name] = f"Keep this under {limit} characters."
                continue
        if name in spec["required"] and not val:
            errors[name] = MESSAGES.get(name, "This field is required.")
            continue
        if val and name in spec.get("choices", {}):
            allowed = spec["choices"][name]
            items = val if isinstance(val, list) else [val]
            if any(i not in allowed for i in items):
                errors[name] = "Choose one of the options given."
                continue
        if name == "email" and val and not EMAIL.match(val):
            errors[name] = MESSAGES["email"]
            continue
        if name == "phone" and val:
            digits = re.sub(r"\D", "", val)
            if not (10 <= len(digits) <= 15) or re.search(r"[^\d\s()+-]", val):
                errors[name] = MESSAGES["phone"]
                continue
        if name == "postcode" and val:
            if not UK_POSTCODE.match(val):
                errors[name] = MESSAGES["postcode"]
                continue
            val = val.upper()
        if name == "marketing_opt_in":
            val = bool(val)
        data[name] = val
    return data, errors


# --------------------------------------------------------------------------- storage
SCHEMA = """
CREATE TABLE IF NOT EXISTS leads (
  ref TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  form_type TEXT NOT NULL,
  data TEXT NOT NULL,
  context TEXT NOT NULL,
  marketing_opt_in INTEGER NOT NULL DEFAULT 0,
  marketing_wording TEXT,
  routed INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  email_ok INTEGER NOT NULL DEFAULT 0,
  crm_ok INTEGER NOT NULL DEFAULT 0,
  confirm_ok INTEGER NOT NULL DEFAULT 0,
  attempts INTEGER NOT NULL DEFAULT 0,
  last_error TEXT
);
"""
DB_LOCK = threading.Lock()


@contextmanager
def db(settings):
    """Open, commit on success, roll back on error, and always close."""
    os.makedirs(os.path.dirname(os.path.abspath(settings.db_path)), exist_ok=True)
    con = sqlite3.connect(settings.db_path, timeout=10)
    try:
        con.row_factory = sqlite3.Row
        con.execute(SCHEMA)
        yield con
        con.commit()
    except Exception:
        con.rollback()
        raise
    finally:
        con.close()


def new_ref():
    alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    return "AV-" + datetime.now(timezone.utc).strftime("%Y%m%d") + "-" + "".join(secrets.choice(alphabet) for _ in range(5))


def store(settings, form_type, data, context):
    ref = new_ref()
    opt = bool(data.get("marketing_opt_in"))
    with DB_LOCK, db(settings) as con:
        con.execute(
            "INSERT INTO leads (ref, created_at, form_type, data, context, marketing_opt_in, marketing_wording, status) VALUES (?,?,?,?,?,?,?,?)",
            (ref, datetime.now(timezone.utc).isoformat(timespec="seconds"), form_type,
             json.dumps(data, ensure_ascii=False), json.dumps(context, ensure_ascii=False),
             1 if opt else 0, MARKETING_WORDING.get(form_type) if opt else None, "received"))
    return ref


# --------------------------------------------------------------------------- delivery
def _smtp(settings):
    if settings.smtp_ssl:
        s = smtplib.SMTP_SSL(settings.smtp_host, settings.smtp_port, timeout=settings.timeout,
                             context=ssl.create_default_context())
    else:
        s = smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=settings.timeout)
        if settings.smtp_starttls:
            s.starttls(context=ssl.create_default_context())
    if settings.smtp_user:
        s.login(settings.smtp_user, settings.smtp_password)
    return s


def send_mail(settings, to, subject, body, reply_to=None):
    msg = EmailMessage()
    msg["From"] = formataddr((settings.mail_from_name, settings.mail_from))
    msg["To"] = ", ".join(to)
    msg["Subject"] = subject
    msg["Message-ID"] = make_msgid(domain=settings.mail_from.split("@")[-1] or None)
    if reply_to:
        msg["Reply-To"] = reply_to
    msg.set_content(body)
    with _smtp(settings) as s:
        s.send_message(msg)


def describe(form_type, data):
    spec = FORMS[form_type]
    lines = []
    for name in spec["required"] + spec["optional"]:
        if name not in data or data[name] in ("", [], False):
            continue
        val = data[name]
        if isinstance(val, list):
            val = ", ".join(spec["choices"]["roles"].get(v, v) for v in val)
        elif isinstance(val, bool):
            val = "Yes"
        elif name in spec.get("choices", {}) and spec["choices"][name].get(val):
            val = spec["choices"][name][val]
        label = name.replace("_", " ").capitalize()
        lines.append(f"{label}: {val}")
    return "\n".join(lines)


def internal_email(settings, ref, form_type, data, context):
    spec = FORMS[form_type]
    urgent = form_type == "employer" and data.get("urgency") == "urgent"
    who = data.get("organisation") or data.get("name")
    subject = f"{'URGENT ' if urgent else ''}{spec['label']}: {who} ({ref})"
    body = (
        f"{'URGENT: cover needed today or tomorrow. Call back now.' + chr(10) + chr(10) if urgent else ''}"
        f"New {spec['label'].lower()} from the website.\n"
        f"Reference: {ref}\n\n{describe(form_type, data)}\n\n"
        f"Page: {context.get('page_url', '')}\nReferrer: {context.get('referrer', '')}\n"
        f"Campaign: {context.get('utm_source', '')} {context.get('utm_medium', '')} {context.get('utm_campaign', '')}\n\n"
        "Reply to this email to reach the sender directly."
    )
    send_mail(settings, settings.to[form_type], subject, body, reply_to=data.get("email"))


CONFIRM = {
    "employer": ("We have your staffing request ({ref})",
                 "Thank you for contacting Aviteus Healthcare.\n\nYour reference is {ref}.\n\n"
                 "A member of our team will contact you to confirm the details of your request.\n"
                 "If you need cover in the next few hours, please call us on {phone} as well. Phone is the fastest way to reach us.\n\n"
                 "We have only used your details to deal with this request. Our privacy notice explains how we handle them:\n{site}/privacy-policy/\n"),
    "candidate": ("Thanks for registering your interest ({ref})",
                  "Thank you for your interest in working with Aviteus Healthcare.\n\nYour reference is {ref}.\n\n"
                  "A recruitment consultant will contact you to talk about the work you want and the next steps.\n"
                  "While you wait, you can see the documents you will need here:\n{site}/candidates/register/#documents\n\n"
                  "We never charge workers a fee for finding them work. If anyone asks you for money in our name, do not pay and tell us.\n\n"
                  "Our privacy notice explains how we handle your details:\n{site}/privacy-policy/\n"),
    "general": ("We have your message ({ref})",
                "Thank you for contacting Aviteus Healthcare.\n\nYour reference is {ref}.\n\n"
                "We will reply by email. If your message is urgent, please call {phone}.\n\n"
                "Our privacy notice explains how we handle your details:\n{site}/privacy-policy/\n"),
}
SIGNOFF = ("\nAviteus Healthcare Ltd\nRegistered in England and Wales, company number 13337393.\n"
           "Registered office: Alpha House, 296 Kenton Road, Kenton, HA3 8DD.\n"
           "This is an automatic email. You can reply to it if you need to add anything.\n")


def confirmation_email(settings, ref, form_type, data):
    subj, body = CONFIRM[form_type]
    reply = settings.to[form_type][0] if settings.to[form_type] else settings.mail_from
    send_mail(settings, [data["email"]], subj.format(ref=ref),
              body.format(ref=ref, phone=settings.phone, site=settings.site_url) + SIGNOFF, reply_to=reply)


def post_crm(settings, ref, form_type, data, context, created_at):
    payload = json.dumps({"ref": ref, "lead_type": form_type, "created_at": created_at,
                          "fields": data, "source": context}).encode()
    req = urllib.request.Request(settings.crm_url, data=payload, method="POST",
                                 headers={"Content-Type": "application/json", "User-Agent": "aviteus-lead-handler/1.0"})
    if settings.crm_token:
        req.add_header("Authorization", "Bearer " + settings.crm_token)
    with urllib.request.urlopen(req, timeout=settings.timeout) as r:
        if not 200 <= r.status < 300:
            raise RuntimeError(f"CRM returned {r.status}")


def deliver(settings, ref):
    """Try every route that has not succeeded yet. Safe to call again."""
    with DB_LOCK, db(settings) as con:
        row = con.execute("SELECT * FROM leads WHERE ref=?", (ref,)).fetchone()
    if not row:
        return
    form_type, data, context = row["form_type"], json.loads(row["data"]), json.loads(row["context"])
    email_ok, crm_ok, confirm_ok = row["email_ok"], row["crm_ok"], row["confirm_ok"]
    errors = []
    if settings.to[form_type] and settings.smtp_host and not email_ok:
        try:
            internal_email(settings, ref, form_type, data, context)
            email_ok = 1
        except Exception as e:
            errors.append(f"email: {type(e).__name__}: {e}")
    if settings.crm_url and not crm_ok:
        try:
            post_crm(settings, ref, form_type, data, context, row["created_at"])
            crm_ok = 1
        except Exception as e:
            errors.append(f"crm: {type(e).__name__}: {e}")
    routed = 1 if (email_ok or crm_ok) else 0
    # Only confirm to the visitor once the business has the lead.
    if routed and settings.send_confirmation and settings.smtp_host and not confirm_ok:
        try:
            confirmation_email(settings, ref, form_type, data)
            confirm_ok = 1
        except Exception as e:
            errors.append(f"confirmation: {type(e).__name__}: {e}")
    wanted_email = bool(settings.to[form_type] and settings.smtp_host)
    wanted_crm = bool(settings.crm_url)
    complete = (email_ok or not wanted_email) and (crm_ok or not wanted_crm) and routed
    status = "delivered" if complete else ("partial" if routed else "pending")
    with DB_LOCK, db(settings) as con:
        con.execute("UPDATE leads SET email_ok=?, crm_ok=?, confirm_ok=?, routed=?, status=?, attempts=attempts+1, last_error=? WHERE ref=?",
                    (email_ok, crm_ok, confirm_ok, routed, status, "; ".join(errors) or None, ref))
    if errors:
        log.error("lead %s %s: %s", ref, status, "; ".join(errors))
    else:
        log.info("lead %s %s", ref, status)


def retry_pending(settings, max_attempts=20):
    with DB_LOCK, db(settings) as con:
        refs = [r["ref"] for r in con.execute(
            "SELECT ref FROM leads WHERE status IN ('received','pending','partial') AND attempts < ?", (max_attempts,))]
    for ref in refs:
        deliver(settings, ref)
    print(f"retried {len(refs)} lead(s)")
    return len(refs)


def purge(settings):
    cutoff = (datetime.now(timezone.utc) - timedelta(days=settings.retention_days)).isoformat(timespec="seconds")
    with DB_LOCK, db(settings) as con:
        n = con.execute("DELETE FROM leads WHERE created_at < ?", (cutoff,)).rowcount
    print(f"deleted {n} lead(s) older than {settings.retention_days} days")
    return n


# --------------------------------------------------------------------------- spam and abuse
class RateLimiter:
    def __init__(self, limit, window):
        self.limit, self.window = limit, window
        self.hits = defaultdict(deque)
        self.lock = threading.Lock()

    def allow(self, key):
        now = time.monotonic()
        with self.lock:
            q = self.hits[key]
            while q and now - q[0] > self.window:
                q.popleft()
            if len(q) >= self.limit:
                return False
            q.append(now)
            return True


def turnstile_ok(settings, token, ip):
    """Optional Cloudflare Turnstile check. Only used if TURNSTILE_SECRET is set."""
    if not settings.turnstile_secret:
        return True
    if not token:
        return False
    body = urllib.parse.urlencode({"secret": settings.turnstile_secret, "response": token, "remoteip": ip}).encode()
    try:
        with urllib.request.urlopen("https://challenges.cloudflare.com/turnstile/v0/siteverify", data=body, timeout=8) as r:
            return bool(json.loads(r.read()).get("success"))
    except Exception as e:
        log.error("turnstile check failed: %s", e)
        return False


# --------------------------------------------------------------------------- HTTP
class Handler(BaseHTTPRequestHandler):
    settings = None
    limiter = None
    server_version = "aviteus"
    sys_version = ""

    def log_message(self, fmt, *args):   # keep personal data out of access logs
        log.debug("%s %s", self.command, self.path.split("?")[0])

    def client_ip(self):
        if self.settings.trust_proxy and self.headers.get("X-Real-IP"):
            return self.headers["X-Real-IP"]
        return self.client_address[0]

    def wants_json(self):
        return "application/json" in (self.headers.get("Accept") or "")

    def send_json(self, code, obj):
        body = json.dumps(obj).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def redirect(self, location):
        self.send_response(303)
        self.send_header("Location", location)
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", "0")
        self.end_headers()

    def fail(self, code, reason, form_type="", errors=None):
        if self.wants_json():
            payload = {"ok": False, "error": reason}
            if errors:
                payload["errors"] = errors
            return self.send_json(code, payload)
        q = urllib.parse.urlencode({"reason": reason, "form": form_type})
        return self.redirect(f"/enquiry-problem/?{q}")

    def do_GET(self):
        path = urllib.parse.urlparse(self.path).path
        if path == "/api/health":
            return self.send_json(200, {"ok": True})
        if self.settings.static_dir:
            return self.serve_static(path)
        self.send_json(404, {"ok": False})

    def serve_static(self, path):
        """Local testing only. In production nginx serves the site."""
        root = os.path.abspath(self.settings.static_dir)
        target = os.path.abspath(os.path.join(root, urllib.parse.unquote(path).lstrip("/")))
        if not target.startswith(root):
            return self.send_json(403, {"ok": False})
        if os.path.isdir(target):
            target = os.path.join(target, "index.html")
        code = 200
        if not os.path.isfile(target):
            target, code = os.path.join(root, "404.html"), 404
        ctype = mimetypes.guess_type(target)[0] or "application/octet-stream"
        with open(target, "rb") as fh:
            body = fh.read()
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
        if urllib.parse.urlparse(self.path).path != "/api/enquiry":
            return self.send_json(404, {"ok": False})
        s = self.settings
        origin = self.headers.get("Origin")
        if origin and origin not in s.allowed_origins:
            return self.fail(403, "origin")
        try:
            length = int(self.headers.get("Content-Length") or 0)
        except ValueError:
            length = 0
        if length <= 0 or length > 20000:
            return self.fail(413, "size")
        ctype = (self.headers.get("Content-Type") or "").split(";")[0].strip()
        if ctype != "application/x-www-form-urlencoded":
            return self.fail(415, "type")
        raw = urllib.parse.parse_qs(self.rfile.read(length).decode("utf-8", "replace"), keep_blank_values=True)
        form_type = (raw.get("lead_type") or [""])[0]
        if form_type not in FORMS:
            return self.fail(400, "form")

        ip = self.client_ip()
        if not self.limiter.allow(ip):
            return self.fail(429, "rate", form_type)

        # Spam signals: pretend success so bots learn nothing, store nothing.
        thanks = FORMS[form_type]["thanks"]
        honeypot = (raw.get("website") or [""])[0].strip()
        try:
            started = float((raw.get("form_ts") or ["0"])[0]) / 1000
        except ValueError:
            started = 0
        too_fast = started and (time.time() - started) < s.min_fill
        if honeypot or too_fast or not turnstile_ok(s, (raw.get("cf-turnstile-response") or [""])[0], ip):
            log.info("spam blocked (%s)", "honeypot" if honeypot else "timing" if too_fast else "turnstile")
            return self.send_json(200, {"ok": True, "redirect": thanks}) if self.wants_json() else self.redirect(thanks)

        data, errors = validate(form_type, raw)
        if errors:
            return self.fail(400, "invalid", form_type, errors)
        context = {k: clean((raw.get(k) or [""])[0])[:300] for k in CONTEXT}

        try:
            ref = store(s, form_type, data, context)
        except Exception as e:
            log.critical("could not store lead: %s", e)
            return self.fail(503, "server", form_type)

        threading.Thread(target=deliver, args=(s, ref), daemon=True).start()
        location = f"{thanks}?ref={ref}"
        if self.wants_json():
            return self.send_json(200, {"ok": True, "redirect": location, "ref": ref})
        return self.redirect(location)


def make_server(settings, host="127.0.0.1", port=8081):
    Handler.settings = settings
    Handler.limiter = RateLimiter(settings.rate_limit, settings.rate_window)
    return ThreadingHTTPServer((host, port), Handler)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--retry", action="store_true")
    ap.add_argument("--purge", action="store_true")
    ap.add_argument("--check-config", action="store_true")
    ap.add_argument("--host", default=env("LISTEN_HOST", "127.0.0.1"))
    ap.add_argument("--port", type=int, default=int(env("LISTEN_PORT", "8081")))
    a = ap.parse_args()
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
    s = Settings()
    if a.check_config:
        probs = s.problems()
        print("\n".join(probs) if probs else "Configuration looks complete.")
        sys.exit(1 if probs else 0)
    if a.retry:
        retry_pending(s)
        return
    if a.purge:
        purge(s)
        return
    for p in s.problems():
        log.warning("config: %s", p)
    srv = make_server(s, a.host, a.port)
    log.info("listening on %s:%s", a.host, a.port)
    srv.serve_forever()


if __name__ == "__main__":
    main()
