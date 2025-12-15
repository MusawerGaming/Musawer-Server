const { spawn } = require("child_process");
const WebSocket = require("ws");
const net = require("net");

// Start Velocity as a child process
const velocity = spawn("java", ["-Xms512M", "-Xmx1G", "-jar", "server.jar"], { cwd: "/server" });

velocity.stdout.on("data", (data) => console.log(`[Velocity] ${data}`));
velocity.stderr.on("data", (data) => console.error(`[Velocity Error] ${data}`));

// Render's required public port (10000)
const WS_PORT = process.env.PORT || 10000;
// Velocity's local private port
const VELOCITY_PORT = 25567;

const wss = new WebSocket.Server({ port: WS_PORT });

wss.on("connection", (ws) => {
    console.log("New Eaglercraft connection detected.");

    // Connect to Velocity on its internal-only local port
    const backend = net.createConnection(VELOCITY_PORT, "127.0.0.1");

    backend.on("data", (data) => {
        if (ws.readyState === WebSocket.OPEN) ws.send(data);
    });

    ws.on("message", (msg) => {
        if (backend.writable) backend.write(msg);
    });

    ws.on("close", () => backend.end());
    backend.on("end", () => ws.close());
    backend.on("error", (err) => {
        console.error("Bridge could not reach Velocity (still booting?):", err.message);
        ws.close();
    });
});

console.log(`Bridge active. Point Eaglercraft to: wss://musawer-server-1.onrender.com`);
