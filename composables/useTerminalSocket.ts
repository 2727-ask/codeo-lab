import { ref } from 'vue'

let ws: WebSocket | null = null

export function useTerminalSocket() {
  if (!ws || ws.readyState === WebSocket.CLOSED) {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
    ws = new WebSocket(`${wsProtocol}://${window.location.host}/_ws`)
  }
  return ws
}