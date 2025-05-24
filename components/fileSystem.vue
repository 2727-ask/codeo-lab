<script lang="ts" setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { useFilesystemStore } from '~/stores/fileSystem'
import { useTabsStore } from '~/stores/tabs'

const fsStore = useFilesystemStore()
const tabsStore = useTabsStore()

async function handleFileSelect(e: CustomEvent) {
  const node = e.detail
  // Only handle files (not folders)
  if (node.children) return

  // Check if tab is already open by path
  const existingTab = tabsStore.tabs.find(tab => tab.path === node.value)
  if (existingTab) {
    tabsStore.setActiveTab(existingTab.id)
    return
  }

  // Fetch file content from API
  const content = await $fetch<string>('/api/fs/read', { params: { path: node.value } })
  tabsStore.addTab({
    title: node.label.replace(/\/$/, ''),
    content,
    language: detectLanguage(node.label),
    path: node.value
  })
}

onMounted(() => {
  window.addEventListener('file-select', handleFileSelect as unknown as EventListener)
  fsStore.fetchFileSystem()
})

onBeforeUnmount(() => {
  window.removeEventListener('file-select', handleFileSelect as unknown as EventListener)
})

// Simple language detector based on extension
function detectLanguage(filename: string) {
  if (filename.endsWith('.ts')) return 'typescript'
  if (filename.endsWith('.js')) return 'javascript'
  if (filename.endsWith('.vue')) return 'vue'
  if (filename.endsWith('.json')) return 'json'
  if (filename.endsWith('.md')) return 'markdown'
  return 'text'
}
</script>

<template>
  <div class="text-left">
    <h6 class="">FILE EXPLORER</h6>
    <div class="mt-2">
     <UTree :items="fsStore.items" />
    </div>
  </div>
</template>