<template>
  <div ref="editorRef" class="w-full h-full"></div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import ace from 'ace-builds'

// Import required Ace modes, themes, and workers
import 'ace-builds/src-noconflict/ace'
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/mode-vue'

const props = defineProps<{
  modelValue: string
  lang: string
}>()
const emits = defineEmits(['update:modelValue'])

const editorRef = ref<HTMLElement | null>(null)
let editor: ace.Ace.Editor

onMounted(() => {
  editor = ace.edit(editorRef.value!)
  editor.setTheme('ace/theme/monokai')
  editor.session.setMode(`ace/mode/${props.lang}`)
  editor.setValue(props.modelValue || '', -1)
  editor.on('change', () => {
    emits('update:modelValue', editor.getValue())
  })
})

watch(() => props.modelValue, (val) => {
  if (editor && editor.getValue() !== val) {
    editor.setValue(val || '', -1)
  }
})

watch(() => props.lang, (lang) => {
  if (editor) editor.session.setMode(`ace/mode/${lang}`)
})

onBeforeUnmount(() => {
  editor?.destroy()
})
</script>

<style scoped>
.w-full.h-full {
  min-height: 200px;
  height: 100%;
}
</style>