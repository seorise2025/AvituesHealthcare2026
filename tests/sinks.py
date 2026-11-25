"""Test doubles: a tiny SMTP server and a CRM webhook receiver. Standard library only."""
import email
import json
import socketserver
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer


class SMTPSink:
    """Accepts mail like a real SMTP server and keeps it in self.messages."""

    def __init__(self, port=0):
        self.messages = []
        sink = self

        class H(socketserver.StreamRequestHandler):
            def handle(self):
                w = lambda s: self.wfile.write((s + "\r\n").encode())
                w("220 test-smtp ready")
                mail_from, rcpts = None, []
                while True:
                    line = self.rfile.readline()
                    if not line:
                        return
                    cmd = line.decode(errors="replace").strip()
                    up = cmd.upper()
                    if up.startswith("EHLO"):
                        self.wfile.write(b"250-test-smtp\r\n250 8BITMIME\r\n")
                    elif up.startswith("HELO"):
                        w("250 test-smtp")
                    elif up.startswith("MAIL FROM"):
                        mail_from, rcpts = cmd[10:].strip(), []
                        w("250 OK")
                    elif up.startswith("RCPT TO"):
                        rcpts.append(cmd[8:].strip().strip("<>"))
                        w("250 OK")
                    elif up == "DATA":
                        w("354 End data with <CR><LF>.<CR><LF>")
                        buf = []
                        while True:
                            l = self.rfile.readline()
                            if l in (b".\r\n", b".\n", b""):
                                break
                            buf.append(l[1:] if l.startswith(b"..") else l)
                        msg = email.message_from_bytes(b"".join(buf))
                        sink.messages.append({"from": mail_from, "to": rcpts, "msg": msg})
                        w("250 OK queued")
                    elif up in ("RSET", "NOOP"):
                        w("250 OK")
                    elif up == "QUIT":
                        w("221 Bye")
                        return
                    else:
                        w("502 not implemented")

        class S(socketserver.ThreadingTCPServer):
            allow_reuse_address = True
            daemon_threads = True

        self.server = S(("127.0.0.1", port), H)
        self.port = self.server.server_address[1]
        threading.Thread(target=self.server.serve_forever, daemon=True).start()

    def stop(self):
        self.server.shutdown()
        self.server.server_close()


class WebhookSink:
    """Receives the CRM webhook. Set .fail = True to return HTTP 500."""

    def __init__(self):
        self.calls, self.fail = [], False
        sink = self

        class H(BaseHTTPRequestHandler):
            def log_message(self, *a):
                pass

            def do_POST(self):
                body = self.rfile.read(int(self.headers.get("Content-Length", 0)))
                if sink.fail:
                    self.send_response(500)
                    self.end_headers()
                    return
                sink.calls.append({"headers": dict(self.headers), "json": json.loads(body)})
                self.send_response(204)
                self.end_headers()

        self.server = ThreadingHTTPServer(("127.0.0.1", 0), H)
        self.url = f"http://127.0.0.1:{self.server.server_address[1]}/hook"
        threading.Thread(target=self.server.serve_forever, daemon=True).start()

    def stop(self):
        self.server.shutdown()
        self.server.server_close()
