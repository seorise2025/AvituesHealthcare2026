#!/usr/bin/env python3
"""
Browser test for the React app in lovable-app/. From the repo root:

    python3 tests/run_app_e2e.py

Builds the app with forms pointed at /api/enquiry, runs the real Python lead
handler with a fake SMTP server, serves the app with `vite preview` (which
proxies /api to the handler), then runs tests/app_e2e.js in Chromium.
"""
import json
import os
import subprocess
import sys
import tempfile
import threading
import time
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
APP = os.path.join(ROOT, "lovable-app")
sys.path.insert(0, os.path.join(ROOT, "server"))
sys.path.insert(0, os.path.join(ROOT, "tests"))
from run_e2e import free_port  # noqa: E402
from sinks import SMTPSink, WebhookSink  # noqa: E402


def main():
    tmp = tempfile.mkdtemp()
    build_env = dict(os.environ, VITE_LEAD_ENDPOINT="/api/enquiry")
    subprocess.run(["npm", "run", "build"], cwd=APP, env=build_env, check=True, stdout=subprocess.DEVNULL)

    smtp, hook = SMTPSink(), WebhookSink()
    hport, aport = free_port(), free_port()
    app_base = f"http://127.0.0.1:{aport}"
    os.environ.update({
        "LEAD_DB_PATH": os.path.join(tmp, "leads.db"),
        "LEAD_TO_EMPLOYER": "bookings@test.example", "LEAD_TO_CANDIDATE": "recruit@test.example",
        "LEAD_TO_GENERAL": "info@test.example", "MAIL_FROM": "no-reply@test.example",
        "SMTP_HOST": "127.0.0.1", "SMTP_PORT": str(smtp.port), "SMTP_STARTTLS": "false",
        "CRM_WEBHOOK_URL": hook.url, "ALLOWED_ORIGINS": app_base, "MIN_FILL_SECONDS": "1",
        "RATE_LIMIT": "200", "TRUST_PROXY": "false", "STATIC_DIR": "",
    })
    import lead_handler as lh
    srv = lh.make_server(lh.Settings(), "127.0.0.1", hport)
    threading.Thread(target=srv.serve_forever, daemon=True).start()

    class Inspect(BaseHTTPRequestHandler):
        def log_message(self, *a):
            pass

        def do_GET(self):
            data = [{"to": m["to"], "subject": m["msg"]["Subject"]} for m in smtp.messages]
            b = json.dumps(data).encode()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(b)

    insp = ThreadingHTTPServer(("127.0.0.1", 0), Inspect)
    threading.Thread(target=insp.serve_forever, daemon=True).start()

    prev = subprocess.Popen(
        ["npx", "vite", "preview", "--host", "127.0.0.1", "--port", str(aport), "--strictPort"],
        cwd=APP, env=dict(os.environ, LEAD_PROXY=f"http://127.0.0.1:{hport}"),
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        for _ in range(60):
            try:
                urllib.request.urlopen(app_base, timeout=1)
                break
            except Exception:
                time.sleep(0.25)
        env = dict(os.environ, BASE=app_base, INSPECT=f"http://127.0.0.1:{insp.server_address[1]}",
                   OUT=os.path.join(ROOT, "docs"))
        code = subprocess.run(["node", os.path.join(ROOT, "tests", "app_e2e.js")],
                              cwd=os.path.join(ROOT, "tests"), env=env).returncode
    finally:
        prev.terminate()
        srv.shutdown()
    sys.exit(code)


if __name__ == "__main__":
    main()
