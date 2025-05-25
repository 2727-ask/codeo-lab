<template>
  <div class="flex flex-col h-full">
    <!-- Tab Bar -->
    <div class="flex border-b bg-gray-100 overflow-x-scroll">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="setActiveTab(tab.id)"
        :class="[
          'px-4 py-2 border-r last:border-r-0',
          tab.id === activeTabId ? 'bg-white font-bold' : 'bg-gray-100'
        ]"
      >
        {{ tab.title }}<span v-if="tab.isDirty">*</span>
        <span class="ml-2 text-xs text-gray-400 cursor-pointer" @click.stop="closeTab(tab.id)">×</span>
      </button>
      <button class="ml-auto px-4 py-2 text-blue-500" @click="addTab()">+</button>
    </div>
    <!-- Editor Area -->
    <div class="flex-1 relative">
      <AceEditor
        v-if="activeTab"
        v-model="activeTab.content"
        :lang="activeTab.language"
        class="absolute inset-0"
        @update:modelValue="onContentChange"
      />
      <div v-else class="flex items-center justify-center h-full text-gray-400">No tab open</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useTabsStore } from '~/stores/tabs'
import AceEditor from '~/components/aceEditor.vue'

const tabsStore = useTabsStore()
const { tabs, activeTabId, activeTab } = storeToRefs(tabsStore)

function setActiveTab(id: string) {
  tabsStore.setActiveTab(id)
}

function closeTab(id: string) {
  tabsStore.closeTab(id)
}

function addTab() {
  tabsStore.addTab()
}

function onContentChange(val: string) {
  if (activeTab.value) {
    tabsStore.updateTabContent(activeTab.value.id, val)
  }
}
</script>