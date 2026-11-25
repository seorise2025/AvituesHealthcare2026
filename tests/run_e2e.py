#!/usr/bin/env python3
"""
End-to-end test runner. From the repo root:

    python3 tests/run_e2e.py

It:
  1. builds dist/preview, dist/qa (production rules, zero approvals) and dist/qa-analytics
  2. starts a fake SMTP server and a fake CRM webhook
  3. starts the real lead handler, serving dist/qa as the website
  4. runs tests/e2e.js (Playwright) against it, mobile and desktop
  5. writes docs/test-results.json and screenshots to docs/screenshots/
"""
import json
import os
import socket
import subprocess
import sys
import tempfile
import threading
from functools import partial
from http.server import BaseHTTPRequestHandler, SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, os.path.join(ROOT, "server"))
sys.path.insert(0, os.path.join(ROOT, "tests"))
from sinks import SMTPSink, WebhookSink  # noqa: E402


def free_port():
    s = socket.socket()
    s.bind(("127.0.0.1", 0))
    p = s.getsockname()[1]
    s.close()
    return p


def run(cmd, **kw):
    print("$", " ".join(cmd))
    subprocess.run(cmd, check=True, cwd=ROOT, **kw)


def static_server(directory):
    class Quiet(SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass
    srv = ThreadingHTTPServer(("127.0.0.1", 0), partial(Quiet, directory=directory))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv, f"http://127.0.0.1:{srv.server_address[1]}"


def main():
    tmp = tempfile.mkdtemp()
    cfg = json.load(open(os.path.join(ROOT, "src", "config.json")))
    cfg["analytics"]["ga4_id"] = "G-TEST12345"
    cfg_path = os.path.join(tmp, "config-analytics.json")
    json.dump(cfg, open(cfg_path, "w"))

    run([sys.executable, "build.py"])
    run([sys.executable, "build.py", "--mode", "production", "--qa"])
    run([sys.executable, "build.py", "--mode", "production", "--qa", "--config", cfg_path, "--out", "dist/qa-analytics"])

    smtp, hook = SMTPSink(), WebhookSink()
    port = free_port()
    base = f"http://127.0.0.1:{port}"
    os.environ.update({
        "LEAD_DB_PATH": os.path.join(tmp, "leads.db"),
        "LEAD_TO_EMPLOYER": "bookings@test.example", "LEAD_TO_CANDIDATE": "recruit@test.example",
        "LEAD_TO_GENERAL": "info@test.example", "MAIL_FROM": "no-reply@test.example",
        "SMTP_HOST": "127.0.0.1", "SMTP_PORT": str(smtp.port), "SMTP_STARTTLS": "false",
        "CRM_WEBHOOK_URL": hook.url, "ALLOWED_ORIGINS": base, "MIN_FILL_SECONDS": "1",
        "RATE_LIMIT": "200", "STATIC_DIR": os.path.join(ROOT, "dist", "qa"), "TRUST_PROXY": "false",
    })
    import lead_handler as lh
    srv = lh.make_server(lh.Settings(), "127.0.0.1", port)
    threading.Thread(target=srv.serve_forever, daemon=True).start()

    class Inspect(BaseHTTPRequestHandler):
        def log_message(self, *a):
            pass

        def do_GET(self):
            if self.path == "/mail":
                data = [{"to": m["to"], "subject": m["msg"]["Subject"], "reply_to": m["msg"]["Reply-To"],
                         "body": m["msg"].get_payload(decode=True).decode()} for m in smtp.messages]
            else:
                data = [c["json"] for c in hook.calls]
            b = json.dumps(data).encode()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(b)

    insp = ThreadingHTTPServer(("127.0.0.1", 0), Inspect)
    threading.Thread(target=insp.serve_forever, daemon=True).start()
    _, abase = static_server(os.path.join(ROOT, "dist", "qa-analytics"))
    _, pbase = static_server(os.path.join(ROOT, "dist", "preview"))

    env = dict(os.environ, BASE=base, ABASE=abase, PBASE=pbase,
               INSPECT=f"http://127.0.0.1:{insp.server_address[1]}", DIST=os.path.join(ROOT, "dist", "qa"),
               OUT=os.path.join(ROOT, "docs"))
    code = subprocess.run(["node", os.path.join(ROOT, "tests", "e2e.js")], cwd=os.path.join(ROOT, "tests"), env=env).returncode
    srv.shutdown()
    sys.exit(code)


if __name__ == "__main__":
    main()
