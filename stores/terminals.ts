import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface TerminalTab {
  id: string
  title: string
}

export const useTerminalsStore = defineStore('terminals', () => {
  const terminals = ref<TerminalTab[]>([])
  const activeTerminalId = ref<string | null>(null)

  function addTerminal(tab: TerminalTab) {
    terminals.value.push(tab)
    activeTerminalId.value = tab.id
  }

  function closeTerminal(id: string) {
    terminals.value = terminals.value.filter(t => t.id !== id)
    if (activeTerminalId.value === id) {
      activeTerminalId.value = terminals.value.length ? terminals.value[0].id : null
    }
  }

  function setActiveTerminal(id: string) {
    activeTerminalId.value = id
  }

  return { terminals, activeTerminalId, addTerminal, closeTerminal, setActiveTerminal }
})