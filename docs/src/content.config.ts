import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'

const docs = defineCollection({
  loader: glob({
    pattern: '**/[^_]*.mdx',
    base: './src/content/docs',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    links: z.object({
      doc: z.string().optional(),
      api: z.string().optional(),
    }).optional(),
  }),
})

export const collections = {
  docs,
}
