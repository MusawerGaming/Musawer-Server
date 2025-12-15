const { spawn } = require("child_process");
const WebSocket = require("ws");
const net = require("net");
const http = require("http");

// Start Velocity
const velocity = spawn("java", ["-Xms512M", "-Xmx1G", "-jar", "server.jar"], { cwd: "/server" });
velocity.stdout.on("data", (data) => console.log(`[Velocity] ${data}`));

const WS_PORT = process.env.PORT || 10000;
const VELOCITY_PORT = 25567;

// Create HTTP server to stop Render's "No open HTTP ports" error
const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end("Bridge is Online");
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
    console.log("Eaglercraft client connected");
    const backend = net.createConnection(VELOCITY_PORT, "127.0.0.1");

    backend.on("data", (data) => ws.send(data));
    ws.on("message", (msg) => { if (backend.writable) backend.write(msg); });
    
    ws.on("close", () => backend.end());
    backend.on("error", (err) => {
        console.error("Velocity not ready yet:", err.message);
        ws.close();
    });
});

server.listen(WS_PORT, () => {
    console.log(`Web/WSS Bridge active on port ${WS_PORT}`);
});
