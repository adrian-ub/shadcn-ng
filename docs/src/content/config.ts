import { defineCollection, z } from 'astro:content'

const docsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    links: z
      .object({
        doc: z.string().optional(),
        api: z.string().optional(),
      })
      .optional(),
  }),
})

export const collections = {
  docs: docsCollection,
}
