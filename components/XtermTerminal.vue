<template>
  <div ref="xtermRef" class="w-full h-full"></div>
</template>

<script setup lang="ts">
import 'xterm/css/xterm.css'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { FitAddon } from 'xterm-addon-fit'
import { Terminal } from 'xterm'
import { useTerminalSocket } from '~/composables/useTerminalSocket' // <-- Import composable

const props = defineProps<{ id: string }>()
const xtermRef = ref<HTMLElement | null>(null)
let term: Terminal
let fitAddon: FitAddon
let ws: WebSocket | null = null
let resizeHandler: any

function send(msg: any) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(msg))
  }
}

onMounted(() => {
  term = new Terminal({ fontSize: 14, theme: { background: '#1e1e1e' } })
  fitAddon = new FitAddon()
  term.loadAddon(fitAddon)
  term.open(xtermRef.value!)
  fitAddon.fit()
  term.focus()

  ws = useTerminalSocket() // <-- Use shared socket

  // Only add event listeners if not already added
  if (!ws.onmessage) {
    ws.onmessage = (event) => {
      let msg
      try { msg = JSON.parse(event.data) } catch { return }
      // Each terminal instance checks if the message is for it
      if (msg.id && msg.id === props.id && msg.type === 'output') {
        term.write(msg.data)
      } else if (msg.id && msg.id === props.id && msg.type === 'exit') {
        term.write('\r\n[Process exited]\r\n')
      }
    }
    ws.onclose = () => {
      term.write('\r\n[Connection closed]\r\n')
    }
  }

  ws.onopen = () => {
    send({ type: 'start', id: props.id, cols: term.cols, rows: term.rows })
  }
  // If already open, send start immediately
  if (ws.readyState === WebSocket.OPEN) {
    send({ type: 'start', id: props.id, cols: term.cols, rows: term.rows })
  }

  term.onData(data => send({ type: 'input', id: props.id, data }))
  term.onResize(({ cols, rows }) => send({ type: 'resize', id: props.id, cols, rows }))

  resizeHandler = () => fitAddon.fit()
  window.addEventListener('resize', resizeHandler)
})

onBeforeUnmount(() => {
  send({ type: 'close', id: props.id }) 
  // Do NOT call ws.close() here!
  term?.dispose()
  window.removeEventListener('resize', resizeHandler)
})
</script>