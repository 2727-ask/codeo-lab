import { promises as fs } from 'fs'
import { join, extname } from 'path'
import type { FileStructure } from '~/interfaces/FileStructure'

const ICONS: Record<string, string> = {
  '.ts': 'i-vscode-icons-file-type-typescript',
  '.vue': 'i-vscode-icons-file-type-vue',
  '.js': 'i-vscode-icons-file-type-js',
  '.json': 'i-vscode-icons-file-type-json',
  '.md': 'i-vscode-icons-file-type-markdown',
  '.nuxt': 'i-vscode-icons-file-type-nuxt',
}

function getIcon(filename: string) {
  const ext = extname(filename)
  if (filename === 'nuxt.config.ts') return ICONS['.nuxt']
  return ICONS[ext] || undefined
}

async function readDirRecursive(absPath: string): Promise<FileStructure[]> {
  const entries = await fs.readdir(absPath, { withFileTypes: true })
  const result: FileStructure[] = await Promise.all(entries.map(async entry => {
    const entryPath = join(absPath, entry.name)
    if (entry.isDirectory()) {
      return {
        label: entry.name + '/',
        defaultExpanded: true,
        children: await readDirRecursive(entryPath)
      }
    } else {
      return {
        label: entry.name,
        icon: getIcon(entry.name)
      }
    }
  }))
  return result
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const baseDir = process.cwd()
  const relPath = (query.path as string) || ''
  const absPath = join(baseDir, relPath)

  // Prevent directory traversal
  if (!absPath.startsWith(baseDir)) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const tree: FileStructure[] = await readDirRecursive(absPath)
  return tree
})