import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { FileStructure } from '~/interfaces/FileStructure'

function addValueToNodes(
  nodes: FileStructure[],
  parentPath = '',
  onSelectFile?: (node: any) => void
): (FileStructure & { value: string; onSelect?: () => void })[] {
  return nodes.map(node => {
    const currentPath = parentPath + node.label
    const isFile = !node.children
    const newNode: FileStructure & { value: string; onSelect?: () => void } = {
      ...node,
      value: currentPath
    }
    if (isFile) {
      newNode.onSelect = () => {
        // You can call a global handler here, or emit an event, or use a callback
        // For example, call a composable or store action to open the file in a tab
        // You can also inject a handler via the store if needed
        window.dispatchEvent(new CustomEvent('file-select', { detail: newNode }))
      }
    }
    if (node.children) {
      newNode.children = addValueToNodes(node.children, currentPath, onSelectFile)
    }
    return newNode
  })
}

export const useFilesystemStore = defineStore('filesystem', () => {
  const items = ref<(FileStructure & { value: string })[]>([])

  async function fetchFileSystem() {
    try {
      const data = await $fetch<FileStructure[]>('/api/fs/list')
      items.value = addValueToNodes(data)
    } catch (e) {
      items.value = []
    }
  }

  // You can add more CRUD methods here (create, update, delete)

  return { items, fetchFileSystem }
})