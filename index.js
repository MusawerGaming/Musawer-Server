import { WebSocketServer } from 'ws'
import net from 'net'

const PORT = process.env.PORT || 8080
const HOST = process.env.BACKEND_HOST || 'musawer.mycuba.live'
const MC = parseInt(process.env.BACKEND_PORT || '25594', 10)

const wss = new WebSocketServer({
  port: PORT,
  perMessageDeflate: false,
  maxPayload: 0
})

wss.on('connection', ws => {
  const sock = net.createConnection({ host: HOST, port: MC })
  sock.setNoDelay(true)

  ws.on('message', d => sock.writable && sock.write(d))
  sock.on('data', d => ws.readyState === ws.OPEN && ws.send(d, { binary: true }))

  ws.on('close', () => sock.destroy())
  sock.on('close', () => ws.close())

  ws.on('error', () => sock.destroy())
  sock.on('error', () => ws.close())
})
