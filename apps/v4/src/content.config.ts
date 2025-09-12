import { docsLoader } from '@astrojs/starlight/loaders'
import { docsSchema } from '@astrojs/starlight/schema'
import { defineCollection, z } from 'astro:content'

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        links: z.object({
          doc: z.string().url().optional(),
          api: z.string().url().optional(),
        }).optional(),
      }),
    }),
  }),
}
