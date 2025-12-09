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

// Timeouts to keep health checks and upgrades stable
server.keepAliveTimeout = 0;
server.headersTimeout = 0;

const wss = new WebSocketServer({
  server,
  perMessageDeflate: false // disable compression for speed/CPU
});

function connectBackend(ws) {
  const backend = net.createConnection({ host: backendHost, port: backendPort });

  backend.on("connect", () => {
    console.log(`Backend connected: ${backendHost}:${backendPort}`);
  });

  backend.on("data", (data) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(data, { binary: true });
    }
  });

  backend.on("end", () => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.close();
    }
  });

  backend.on("error", (err) => {
    console.error("Backend error:", err.message);
    // Clean up and retry after 5s if client is still connected
    try { backend.destroy(); } catch {}
    if (ws.readyState === WebSocket.OPEN) {
      setTimeout(() => {
        console.log("Retrying backend connection in 5s...");
        const retryBackend = connectBackend(ws);
        // Rebind message forwarding to the new backend
        ws._backend = retryBackend;
      }, 5000);
    }
  });

  return backend;
}

wss.on("connection", (ws) => {
  console.log("New WS connection");
  ws.binaryType = "arraybuffer";

  // Establish initial backend connection
  ws._backend = connectBackend(ws);

  // Forward WS -> TCP (binary safe)
  ws.on("message", (msg) => {
    const backend = ws._backend;
    if (backend && backend.writable) {
      backend.write(Buffer.isBuffer(msg) ? msg : Buffer.from(msg));
    }
  });

  // Keep-alive: respond to pings
  ws.on("ping", () => {
    if (ws.readyState === WebSocket.OPEN) ws.pong();
  });

  // Clean shutdowns
  ws.on("close", () => {
    const backend = ws._backend;
    if (backend) {
      try { backend.end(); } catch {}
      try { backend.destroy(); } catch {}
    }
  });

  ws.on("error", (err) => {
    console.warn("WS error:", err.message);
  });
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
});
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
});

server.listen(port, () => {
  console.log(`HTTP+WSS bridge listening on ${port}, forwarding to ${backendHost}:${backendPort}`);
});
