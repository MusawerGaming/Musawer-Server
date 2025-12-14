# healthcheck.py
from http.server import BaseHTTPRequestHandler, HTTPServer

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "text/plain")
        self.end_headers()
        self.wfile.write(b"OK\n")

if __name__ == "__main__":
    server = HTTPServer(("0.0.0.0", int(8000)), Handler)
    server.serve_forever()
