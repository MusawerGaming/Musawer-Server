import { WebSocketServer } from 'ws'
import net from 'net'

const PORT = process.env.PORT || 8080
const HOST = process.env.BACKEND_HOST || 'musawer.mycuba.live'
const MC = parseInt(process.env.BACKEND_PORT || '25594', 10)

console.log(`[Bridge] Starting WebSocket bridge on port ${PORT}`)
console.log(`[Bridge] Backend target: ${HOST}:${MC}`)

const wss = new WebSocketServer({
  port: PORT,
  perMessageDeflate: false,
  maxPayload: 0
})

wss.on('connection', ws => {
  console.log('[Bridge] New client connected')

  const sock = net.createConnection({ host: HOST, port: MC }, () => {
    console.log('[Bridge] Connected to backend successfully')
  })

  sock.setNoDelay(true)

  ws.on('message', d => {
    if (sock.writable) {
      sock.write(d)
    } else {
      console.error('[Error] Tried to write to backend but socket not writable')
    }
  })

  sock.on('data', d => {
    if (ws.readyState === ws.OPEN) {
      ws.send(d, { binary: true })
    } else {
      console.error('[Error] Tried to send to client but WS not open')
    }
  })

  ws.on('close', () => {
    console.log('[Bridge] Client disconnected')
    sock.destroy()
  })

  sock.on('close', () => {
    console.log('[Bridge] Backend connection closed')
    ws.close()
  })

  ws.on('error', err => {
    console.error('[Error] WebSocket error:', err.message)
    sock.destroy()
  })

  sock.on('error', err => {
    console.error('[Error] Backend socket error:', err.message)
    ws.close()
  })
})

wss.on('error', err => {
  console.error('[Error] WebSocketServer error:', err.message)
})
