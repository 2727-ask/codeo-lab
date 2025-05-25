import type { Peer, Message } from 'crossws'
import nodePty from 'node-pty'

export default defineWebSocketHandler({
  open(peer: Peer) {
    // Store a map of PTYs for this peer
    (peer as any).ptys = {}
  },

  message(peer: Peer, message: Message) {
    let data
    try { data = JSON.parse(message.toString()) } catch { return }

    // Start a new terminal session
    if (data.type === 'start' && data.id) {
      const ptys = (peer as any).ptys
      if (ptys[data.id]) return // Already started for this id

      const shell = process.env.SHELL || (process.platform === 'win32' ? 'powershell.exe' : 'bash')
      const pty = nodePty.spawn(shell, [], {
        name: 'xterm-color',
        cols: data.cols || 80,
        rows: data.rows || 24,
        cwd: process.cwd(),
        env: process.env,
      })
      ptys[data.id] = pty

      pty.onData((chunk) => {
        peer.send(JSON.stringify({ type: 'output', id: data.id, data: chunk }))
      })
      pty.onExit(() => {
        peer.send(JSON.stringify({ type: 'exit', id: data.id }))
        delete ptys[data.id]
      })
    }

    // Handle input
    if (data.type === 'input' && data.id && (peer as any).ptys[data.id]) {
      (peer as any).ptys[data.id].write(data.data)
    }

    // Handle resize
    if (data.type === 'resize' && data.id && (peer as any).ptys[data.id]) {
      (peer as any).ptys[data.id].resize(data.cols, data.rows)
    }

    // Handle close
    if (data.type === 'close' && data.id && (peer as any).ptys[data.id]) {
      (peer as any).ptys[data.id].kill()
      delete (peer as any).ptys[data.id]
    }
  },

//   close(peer: Peer) {
//     // Kill all PTYs for this peer
//     const ptys = (peer as any).ptys || {}
//     Object.values(ptys).forEach((pty: any) => pty.kill());
//     (peer as any).ptys = {}
//   }
})