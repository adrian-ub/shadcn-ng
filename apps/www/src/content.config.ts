import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'

const docs = defineCollection({
  loader: glob({
    pattern: '**/[^_]*.mdx',
    base: './src/content/docs',
    generateId: ({ entry }) =>
      entry.replace(/\.mdx$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    icon: z.string().optional(),
    full: z.boolean().optional(),
    links: z
      .object({
        doc: z.string().optional(),
        api: z.string().optional(),
      })
      .optional(),
  }),
})

const meta = defineCollection({
  loader: glob({
    pattern: '**/meta.json',
    base: './src/content/docs',
    generateId: ({ entry }) =>
      entry.replace(/\/meta\.json$/, ''),
  }),
  schema: z.object({
    title: z.string().optional(),
    pages: z.array(z.string()).optional(),
    description: z.string().optional(),
    root: z.boolean().optional(),
    defaultOpen: z.boolean().optional(),
    icon: z.string().optional(),
  }),
})

export const collections = { docs, meta }
