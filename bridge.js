// bridge.js
import WebSocket, { WebSocketServer } from "ws";
import { createBackendClient } from "./sdkAdapter.js";

const LISTEN_PORT = parseInt(process.env.BRIDGE_LISTEN_PORT || "8080", 10);
const BRIDGE_PATH = process.env.BRIDGE_PATH || "/";
const BACKEND_WS_URL = process.env.BACKEND_WS_URL || "ws://example.com:0000";
const USE_SDK = (process.env.USE_SDK || "false").toLowerCase() === "true";
const ORIGIN_ALLOWLIST = (process.env.ORIGIN_ALLOWLIST || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

const server = new WebSocketServer({ port: LISTEN_PORT, path: BRIDGE_PATH });
console.log(
  `Bridge listening on ws://0.0.0.0:${LISTEN_PORT}${BRIDGE_PATH} -> ${BACKEND_WS_URL} (SDK: ${USE_SDK})`
);

function originAllowed(origin) {
  if (ORIGIN_ALLOWLIST.length === 0) return true; // allow all if not set
  try {
    if (!origin) return false;
    const o = origin.toLowerCase();
    return ORIGIN_ALLOWLIST.some(allowed => o === allowed.toLowerCase());
  } catch {
    return false;
  }
}

server.on("connection", async (client, req) => {
  if (!originAllowed(req.headers.origin || "")) {
    console.warn(`Blocked origin: ${req.headers.origin}`);
    client.close(1008, "Origin not allowed");
    return;
  }

  console.log(`Browser connected from ${req.socket.remoteAddress}`);
  const backend = await createBackendClient({
    url: BACKEND_WS_URL,
    useSdk: USE_SDK,
    username: "BridgeBot",
  });

  let heartbeat;
  const startHeartbeat = () => {
    heartbeat = setInterval(() => {
      try {
        if (client.readyState === WebSocket.OPEN) client.ping();
        backend.ping?.();
      } catch (e) {
        // ignore
      }
    }, 25000);
  };

  // Browser -> Backend
  client.on("message", (data) => {
    backend.send(data);
  });

  // Backend -> Browser
  backend.onMessage((data) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });

  backend.onOpen(() => {
    console.log("Connected to backend");
    startHeartbeat();
  });

  const cleanup = () => {
    clearInterval(heartbeat);
    try {
      backend.close();
    } catch {
      /* noop */
    }
  };

  backend.onClose((code, reason) => {
    console.log(`Backend closed: ${code} ${reason}`);
    if (client.readyState === WebSocket.OPEN) client.close(code, reason);
    cleanup();
  });

  backend.onError((err) => {
    console.error("Backend error:", err?.message || err);
    if (client.readyState === WebSocket.OPEN) client.close(1011, "Backend error");
    cleanup();
  });

  client.on("close", () => {
    backend.close();
    cleanup();
  });

  client.on("error", (err) => {
    console.error("Client error:", err?.message || err);
    backend.close();
    cleanup();
  });
});
