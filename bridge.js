// WebSocket <-> TCP bridge (single env var: SERVER)
import WebSocket, { WebSocketServer } from "ws";
import net from "net";

const SERVER = process.env.SERVER || "example.com:0000";
const LISTEN_PORT = 8080; // fixed
const BRIDGE_PATH = "/";  // fixed

function parseHostPort(hp) {
  const idx = hp.lastIndexOf(":");
  if (idx === -1) throw new Error("SERVER must be host:port");
  const host = hp.slice(0, idx);
  const port = Number(hp.slice(idx + 1));
  if (!host || !Number.isFinite(port)) throw new Error("Invalid SERVER format");
  return { host, port };
}

const { host, port } = parseHostPort(SERVER);
const wss = new WebSocketServer({ port: LISTEN_PORT, path: BRIDGE_PATH });

console.log(`Bridge: ws://0.0.0.0:${LISTEN_PORT}${BRIDGE_PATH} -> tcp://${host}:${port}`);

wss.on("connection", (client, req) => {
  console.log(`Browser connected from ${req.socket.remoteAddress}`);

  const tcp = net.createConnection({ host, port }, () => {
    console.log("Connected to backend TCP");
  });

  // WS -> TCP
  client.on("message", (data) => {
    if (tcp.destroyed) return;
    // Ensure Buffer for binary writes
    const buf = Buffer.isBuffer(data) ? data : Buffer.from(data);
    tcp.write(buf);
  });

  // TCP -> WS
  tcp.on("data", (chunk) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(chunk, { binary: true });
    }
  });

  // Backpressure and errors
  tcp.on("drain", () => {
    // optional: could resume if you add pause logic
  });

  tcp.on("error", (err) => {
    console.error("TCP error:", err.message);
    if (client.readyState === WebSocket.OPEN) client.close(1011, "TCP error");
  });

  client.on("error", (err) => {
    console.error("WS client error:", err.message);
    if (!tcp.destroyed) tcp.destroy();
  });

  // Close both sides together
  tcp.on("close", () => {
    if (client.readyState === WebSocket.OPEN) client.close();
  });

  client.on("close", () => {
    if (!tcp.destroyed) tcp.destroy();
  });

  // Keepalive pings to keep proxies happy
  const hb = setInterval(() => {
    if (client.readyState === WebSocket.OPEN) {
      try { client.ping(); } catch {}
    } else {
      clearInterval(hb);
    }
  }, 25000);
});
