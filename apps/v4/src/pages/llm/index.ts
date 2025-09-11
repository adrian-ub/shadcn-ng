import type { APIRoute } from 'astro'

import { getEntry } from 'astro:content'

export const GET: APIRoute = async () => {
  const docs = await getEntry('docs', 'docs')

  const data = await import(/* @vite-ignore */`../../../${docs?.filePath}?raw`)

  return new Response(data.default, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  })
}
