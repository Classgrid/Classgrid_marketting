"""
Fake Python backend demo.

This file is intentionally standalone and is not connected to the real
Classgrid app or backend. Run it only if you want a tiny mock API to play with.
"""

from http.server import BaseHTTPRequestHandler, HTTPServer
import json
from urllib.parse import urlparse


MOCK_STUDENTS = [
    {"id": 1, "name": "Nikhil", "grade": "A", "attendance": "96%"},
    {"id": 2, "name": "Aarav", "grade": "B+", "attendance": "91%"},
    {"id": 3, "name": "Meera", "grade": "A+", "attendance": "98%"},
]


class FakeBackendHandler(BaseHTTPRequestHandler):
    def send_json(self, status_code, payload):
        body = json.dumps(payload, indent=2).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        path = urlparse(self.path).path

        if path == "/":
            self.send_json(
                200,
                {
                    "service": "Fake Classgrid Python Backend",
                    "status": "online",
                    "routes": ["/health", "/students", "/analytics"],
                },
            )
            return

        if path == "/health":
            self.send_json(200, {"ok": True, "message": "Fake backend is healthy"})
            return

        if path == "/students":
            self.send_json(200, {"students": MOCK_STUDENTS, "total": len(MOCK_STUDENTS)})
            return

        if path == "/analytics":
            self.send_json(
                200,
                {
                    "activeUsers": 128,
                    "openTickets": 7,
                    "monthlyGrowth": "18%",
                    "note": "Random mock data for frontend testing only",
                },
            )
            return

        self.send_json(404, {"error": "Route not found", "path": path})


def run():
    host = "127.0.0.1"
    port = 5050
    server = HTTPServer((host, port), FakeBackendHandler)
    print(f"Fake backend running at http://{host}:{port}")
    print("Try: /health, /students, /analytics")
    server.serve_forever()


if __name__ == "__main__":
    run()
