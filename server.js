import { WebSocketServer } from "ws";
import net from "net";

const port = process.env.PORT || 3000;
const backendHost = "musawer.mycuba.live";
const backendPort = 25594;

const wss = new WebSocketServer({ port });

wss.on("connection", (ws) => {
  const backend = net.createConnection({ host: backendHost, port: backendPort });
  ws.on("message", (msg) => backend.write(msg));
  backend.on("data", (data) => ws.send(data));
  ws.on("close", () => backend.end());
  backend.on("end", () => ws.close());
});

console.log(`WSS bridge running on port ${port}`);
