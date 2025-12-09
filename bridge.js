import http from "http";
import WebSocket, { WebSocketServer } from "ws";
import net from "net";

const port = process.env.PORT;
const backendHost = "musawer.mycuba.live";
const backendPort = 25594;

if (!port) {
  console.error("PORT is not set. Render must inject process.env.PORT.");
  process.exit(1);
}

// Minimal HTTP server for Render health check
const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("OK");
  } else {
    res.writeHead(404);
    res.end();
  }
});

const wss = new WebSocketServer({
  server,
  perMessageDeflate: false // disable compression for speed
});

wss.on("connection", (ws) => {
  console.log("New WS connection");
  const backend = net.createConnection({ host: backendHost, port: backendPort });

  ws.on("message", (msg) => {
    if (backend.writable) backend.write(Buffer.isBuffer(msg) ? msg : Buffer.from(msg));
  });

  backend.on("data", (data) => {
    if (ws.readyState === WebSocket.OPEN) ws.send(data, { binary: true });
  });

  ws.on("close", () => backend.end());
  backend.on("end", () => {
    if (ws.readyState === WebSocket.OPEN) ws.close();
  });

  ws.on("error", (err) => console.warn("WS error:", err.message));
  backend.on("error", (err) => {
    console.warn("Backend error:", err.message);
    if (ws.readyState === WebSocket.OPEN) ws.close();
  });
});

server.listen(port, () => {
  console.log(`HTTP+WSS bridge listening on ${port}, forwarding to ${backendHost}:${backendPort}`);
});
