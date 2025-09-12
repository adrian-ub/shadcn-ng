import type { APIRoute } from 'astro'
import fs from 'node:fs'
import { getEntry } from 'astro:content'

export const GET: APIRoute = async () => {
  const docs = await getEntry('docs', 'docs')
  const data = fs.readFileSync(docs?.filePath || '', 'utf-8')
  return new Response(data, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  })
}
