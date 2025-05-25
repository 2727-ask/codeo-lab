<template>
  <div class="flex flex-col h-full w-full">
    <div class="flex border-b bg-gray-100 overflow-x-scroll">
      <button
        v-for="tab in terminals"
        :key="tab.id"
        @click="setActiveTerminal(tab.id)"
        :class="[
          'px-4 py-2 border-r last:border-r-0',
          tab.id === activeTerminalId ? 'bg-white font-bold' : 'bg-gray-100',
        ]"
      >
        {{ tab.title }}
        <span
          class="ml-2 text-xs text-gray-400 cursor-pointer"
          @click.stop="closeTerminal(tab.id)"
          >×</span
        >
      </button>
      <button class="ml-auto px-4 py-2 text-blue-500" @click="addTerminal()">
        +
      </button>
    </div>
    <div class="flex-1 relative">
      <client-only>
        <XtermTerminal
          v-for="tab in terminals"
          v-show="tab.id === activeTerminalId"
          :key="tab.id"
          :id="tab.id"
          class="absolute inset-0"
        />
      </client-only>

      <div
        v-if="!activeTerminalId"
        class="flex items-center justify-center h-full text-gray-400"
      >
        No terminal open
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineNuxtComponent({ ssr: false })
import 'xterm/css/xterm.css'
import { storeToRefs } from "pinia";
import { useTerminalsStore } from "~/stores/terminals";
import XtermTerminal from "~/components/XtermTerminal.vue";
import { v4 as uuid } from "uuid";

const terminalsStore = useTerminalsStore();
const { terminals, activeTerminalId } = storeToRefs(terminalsStore);

function addTerminal() {
  const newId = uuid();
  terminalsStore.addTerminal({
    id: newId,
    title: `Terminal ${terminals.value.length + 1}`,
  });
  terminalsStore.setActiveTerminal(newId);
}

function closeTerminal(id: string) {
  terminalsStore.closeTerminal(id);
}
function setActiveTerminal(id: string) {
  terminalsStore.setActiveTerminal(id);
}
</script>
