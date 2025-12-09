import WebSocket from "ws";
import net from "net";

// Render injects PORT automatically (usually 10000)
const port = process.env.PORT;
const backendHost = "musawer.mycuba.live";
const backendPort = 25594;

const wss = new WebSocket.Server({ port });

wss.on("connection", (ws) => {
  const backend = net.createConnection({ host: backendHost, port: backendPort });

  ws.on("message", (msg) => backend.write(msg));
  backend.on("data", (data) => ws.send(data));

  ws.on("close", () => backend.end());
  backend.on("end", () => ws.close());
});

console.log(`WSS bridge listening on ${port}, forwarding to ${backendHost}:${backendPort}`);
