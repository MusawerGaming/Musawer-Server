const { spawn } = require("child_process");
const WebSocket = require("ws");
const net = require("net");

// Start Velocity proxy
const velocity = spawn("java", ["-jar", "server.jar"], { cwd: "/server" });

velocity.stdout.on("data", (data) => console.log(data.toString()));
velocity.stderr.on("data", (data) => console.error(data.toString()));
velocity.on("exit", (code) => console.log(`Velocity exited with code ${code}`));

// Render assigns PORT for WebSocket service
const WS_PORT = process.env.PORT || 10000;
const VELOCITY_PORT = 25567;

const wss = new WebSocket.Server({ port: WS_PORT });

wss.on("connection", (ws) => {
  console.log("Browser connected");

  // Connect to Velocity backend
  const backend = net.createConnection(VELOCITY_PORT, "127.0.0.1", () => {
    console.log("Bridge connected to Velocity");
  });

  // Browser → Velocity
  ws.on("message", (msg) => backend.write(msg));

  // Velocity → Browser
  backend.on("data", (data) => ws.send(data));

  // Cleanup
  ws.on("close", () => backend.end());
  backend.on("end", () => ws.close());

  backend.on("error", (err) => {
    console.error("Backend error:", err);
    ws.close();
  });
});
