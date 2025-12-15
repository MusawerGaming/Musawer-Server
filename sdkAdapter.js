// sdkAdapter.js
// This adapter lets you run the bridge in two modes:
// 1) Raw WS relay to a WebSocket backend
// 2) Protocol-aware mode using eaglercraft-sdk (if USE_SDK=true)

import WebSocket from "ws";

export async function createBackendClient({ url, useSdk, username }) {
  if (!useSdk) {
    const ws = new WebSocket(url);

    const handlers = {
      open: [],
      close: [],
      error: [],
      message: [],
    };

    ws.on("open", () => handlers.open.forEach((h) => h()));
    ws.on("close", (code, reason) => handlers.close.forEach((h) => h(code, reason)));
    ws.on("error", (err) => handlers.error.forEach((h) => h(err)));
    ws.on("message", (data) => handlers.message.forEach((h) => h(data)));

    return {
      send: (data) => {
        if (ws.readyState === WebSocket.OPEN) ws.send(data);
      },
      onMessage: (fn) => handlers.message.push(fn),
      onOpen: (fn) => handlers.open.push(fn),
      onClose: (fn) => handlers.close.push(fn),
      onError: (fn) => handlers.error.push(fn),
      ping: () => {
        if (ws.readyState === WebSocket.OPEN) ws.ping();
      },
      close: () => {
        try {
          ws.close();
        } catch {
          /* noop */
        }
      },
    };
  }

  // SDK mode
  let EaglerClient;
  try {
    // Dynamically import to avoid breaking non-SDK mode
    ({ EaglerClient } = await import("eaglercraft-sdk"));
  } catch (e) {
    console.warn("Failed to load eaglercraft-sdk, falling back to raw WS mode:", e?.message || e);
    return createBackendClient({ url, useSdk: false, username });
  }

  const client = new EaglerClient({
    relay: url,         // SDK expects a relay/server URL
    username: username, // visible or service username
  });

  const handlers = {
    open: [],
    close: [],
    error: [],
    message: [],
  };

  // Map SDK events to adapter events.
  // NOTE: Event names may differ by SDK version; adjust as needed.
  client.on("open", () => handlers.open.forEach((h) => h()));
  client.on("disconnect", (code, reason) => handlers.close.forEach((h) => h(code, reason)));
  client.on("error", (err) => handlers.error.forEach((h) => h(err)));

  // For SDK payloads, normalize to Buffer/Uint8Array for raw transport.
  client.on("packet", (packet) => {
    handlers.message.forEach((h) => h(packet));
  });

  return {
    send: (data) => {
      // If your SDK uses a specific method to send low-level packets, use that.
      // Otherwise, adapt high-level API (e.g., chat messages) as needed.
      if (typeof client.sendPacket === "function") {
        client.sendPacket(data);
      } else if (typeof client.write === "function") {
        client.write(data);
      } else if (typeof client.chat === "function") {
        // As a fallback, treat incoming data as text and send as chat
        const text = data?.toString?.() || String(data);
        client.chat(text);
      }
    },
    onMessage: (fn) => handlers.message.push(fn),
    onOpen: (fn) => handlers.open.push(fn),
    onClose: (fn) => handlers.close.push(fn),
    onError: (fn) => handlers.error.push(fn),
    ping: () => {
      if (typeof client.ping === "function") client.ping();
    },
    close: () => {
      if (typeof client.disconnect === "function") client.disconnect();
    },
  };
}
