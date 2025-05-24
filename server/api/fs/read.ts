import { promises as fs } from 'fs'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const baseDir = process.cwd()
  const relPath = (query.path as string) || ''
  const absPath = join(baseDir, relPath)

  // Prevent directory traversal
  if (!absPath.startsWith(baseDir)) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  try {
    const content = await fs.readFile(absPath, 'utf-8')
    return content
  } catch (err) {
    throw createError({ statusCode: 404, statusMessage: 'File not found' })
  }
})