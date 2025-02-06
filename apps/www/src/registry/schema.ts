import * as v from 'valibot'

export const blockChunkSchema = v.object({
  name: v.string(),
  description: v.string(),
  component: v.any(),
  file: v.string(),
  code: v.optional(v.string()),
  container: v.optional(
    v.object({
      className: v.nullish(v.string()),
    }),
  ),
})

export const registryItemTypeSchema = v.picklist([
  'registry:style',
  'registry:lib',
  'registry:example',
  'registry:block',
  'registry:component',
  'registry:ui',
  'registry:theme',
  'registry:page',
])

export const registryItemFileSchema = v.union([
  v.string(),
  v.object({
    path: v.string(),
    content: v.optional(v.string()),
    type: registryItemTypeSchema,
    target: v.optional(v.string()),
  }),
])

export const registryItemTailwindSchema = v.object({
  config: v.object({
    content: v.optional(v.array(v.string())),
    theme: v.optional(v.record(v.string(), v.any())),
    plugins: v.optional(v.array(v.string())),
  }),
})

export const registryItemCssVarsSchema = v.object({
  light: v.optional(v.record(v.string(), v.string())),
  dark: v.optional(v.record(v.string(), v.string())),
})

export const registryEntrySchema = v.object({
  name: v.string(),
  type: registryItemTypeSchema,
  description: v.optional(v.string()),
  dependencies: v.optional(v.array(v.string())),
  devDependencies: v.optional(v.array(v.string())),
  registryDependencies: v.optional(v.array(v.string())),
  files: v.optional(v.array(registryItemFileSchema)),
  tailwind: v.optional(registryItemTailwindSchema),
  cssVars: v.optional(registryItemCssVarsSchema),
  source: v.optional(v.string()),
  category: v.optional(v.string()),
  subcategory: v.optional(v.string()),
  chunks: v.optional(v.array(blockChunkSchema)),
})

export const registrySchema = v.array(registryEntrySchema)

export type RegistryEntry = v.InferOutput<typeof registryEntrySchema>

export type Registry = v.InferOutput<typeof registrySchema>

export const blockSchema = v.object({
  ...registryEntrySchema.entries,
  type: v.literal('registry:block'),
  style: v.picklist(['default', 'new-york']),
  component: v.any(),
  container: v.optional(
    v.object({
      height: v.nullish(v.string()),
      className: v.nullish(v.string()),
    }),
  ),
  code: v.string(),
  highlightedCode: v.string(),
})

export type Block = v.InferOutput<typeof blockSchema>

export type BlockChunk = v.InferOutput<typeof blockChunkSchema>
