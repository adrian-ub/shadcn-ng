import type { APIRoute } from 'astro'
import { getCollection, getEntry } from 'astro:content'

export const GET: APIRoute = async ({ params }) => {
  const docs = await getEntry('docs', `docs/${params.slug}`)
  const data = await import(/* @vite-ignore */`../../../${docs?.filePath}?raw`)
  return new Response(data.default, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  })
}

export async function getStaticPaths() {
  const docs = (await getCollection('docs', ({ id }) => {
    return id.startsWith('docs/')
  })).map(doc => ({
    ...doc,
    id: doc.id.replace('docs/', ''),
  }))

  return docs.map(doc => ({
    params: {
      slug: doc.id,
    },
  }))
}
