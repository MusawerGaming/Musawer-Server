const WebSocket = require("ws");
const net = require("net");

const WS_PORT = process.env.PORT || 8080; // Render will expose this
const VELOCITY_HOST = "127.0.0.1";        // Velocity runs inside same container
const VELOCITY_PORT = 25567;

const wss = new WebSocket.Server({ port: WS_PORT });

wss.on("connection", (ws) => {
  console.log("Browser connected");

  // Connect to Velocity proxy
  const backend = net.createConnection(VELOCITY_PORT, VELOCITY_HOST, () => {
    console.log("Connected to Velocity");
  });

  // Browser → Velocity
  ws.on("message", (msg) => backend.write(msg));

  // Velocity → Browser
  backend.on("data", (data) => ws.send(data));

  // Cleanup
  ws.on("close", () => backend.end());
  backend.on("end", () => ws.close());
});
