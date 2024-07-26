import { defineCollection, z } from "astro:content";
import { docsSchema } from "@astrojs/starlight/schema";

export const collections = {
  docs: defineCollection({
    schema: docsSchema({
      extend: z.object({
        links: z
          .object({
            doc: z.string().optional(),
            api: z.string().optional(),
          })
          .optional(),
      }),
    }),
  }),
};
