const { spawn } = require("child_process");
const WebSocket = require("ws");
const net = require("net");

// Start Velocity
const velocity = spawn("java", ["-jar", "server.jar"], { cwd: "/server" });

velocity.stdout.on("data", (data) => console.log(data.toString()));
velocity.stderr.on("data", (data) => console.error(data.toString()));

// Start WebSocket bridge
const WS_PORT = process.env.PORT || 10000; // Render will expose this
const VELOCITY_HOST = "127.0.0.1";
const VELOCITY_PORT = 25567;

const wss = new WebSocket.Server({ port: WS_PORT });

wss.on("connection", (ws) => {
  console.log("Browser connected");
  const backend = net.createConnection(VELOCITY_PORT, VELOCITY_HOST);
  ws.on("message", (msg) => backend.write(msg));
  backend.on("data", (data) => ws.send(data));
  ws.on("close", () => backend.end());
  backend.on("end", () => ws.close());
});
