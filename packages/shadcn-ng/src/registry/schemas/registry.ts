import { z } from 'zod'

// ── RegistryItemType ─────────────────────────────────────────────────────

export const registryItemTypeSchema = z.enum([
  'registry:lib',
  'registry:block',
  'registry:component',
  'registry:ui',
  'registry:service',
  'registry:page',
  'registry:file',

  // Internal use only
  'registry:theme',
  'registry:example',
  'registry:style',
  'registry:internal',
])

export type RegistryItemType = z.infer<typeof registryItemTypeSchema>

// ── RegistryItemFile ─────────────────────────────────────────────────────

export const registryItemFileSchema = z.discriminatedUnion('type', [
  z.object({
    path: z.string(),
    content: z.string().optional(),
    type: z.enum(['registry:file', 'registry:page']),
    target: z.string(),
  }),
  z.object({
    path: z.string(),
    content: z.string().optional(),
    type: registryItemTypeSchema.exclude(['registry:file', 'registry:page']),
    target: z.string().optional(),
  }),
])

export type RegistryItemFile = z.infer<typeof registryItemFileSchema>

// ── RegistryItemTailwind ─────────────────────────────────────────────────

export const registryItemTailwindSchema = z.object({
  config: z
    .object({
      plugins: z.array(z.string()).optional(),
      theme: z.record(z.string(), z.any()).optional(),
    })
    .optional(),
})

export type RegistryItemTailwind = z.infer<typeof registryItemTailwindSchema>

// ── RegistryItemCssVars ──────────────────────────────────────────────────

export const registryItemCssVarsSchema = z.object({
  light: z.record(z.string(), z.string()).optional(),
  dark: z.record(z.string(), z.string()).optional(),
})

export type RegistryItemCssVars = z.infer<typeof registryItemCssVarsSchema>

// ── RegistryItem ─────────────────────────────────────────────────────────

export const registryItemSchema = z.object({
  $schema: z.string().optional(),
  name: z.string().min(1, 'Item name is required'),
  type: registryItemTypeSchema,
  title: z.string().optional(),
  author: z.string().min(2).optional(),
  description: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  devDependencies: z.array(z.string()).optional(),
  registryDependencies: z.array(z.string()).optional(),
  files: z.array(registryItemFileSchema).optional(),
  tailwind: registryItemTailwindSchema.optional(),
  cssVars: registryItemCssVarsSchema.optional(),
  meta: z.record(z.string(), z.any()).optional(),
  docs: z.string().optional(),
  categories: z.array(z.string()).optional(),
})

export type RegistryItem = z.infer<typeof registryItemSchema>

// ── Registry (full index wrapper) ─────────────────────────────────────────

export const registrySchema = z.object({
  name: z.string(),
  homepage: z.string(),
  items: z.array(registryItemSchema),
})

export type Registry = z.infer<typeof registrySchema>

// ── RegistryIndex (flat array of items) ────────────────────────────────────

export const registryIndexSchema = z.array(registryItemSchema)

export type RegistryIndex = z.infer<typeof registryIndexSchema>

// ── RegistryResolvedItemsTree (projection for resolve output) ──────────────

export const registryResolvedItemsTreeSchema = registryItemSchema.pick({
  dependencies: true,
  devDependencies: true,
  files: true,
  tailwind: true,
  cssVars: true,
  docs: true,
})

export type RegistryResolvedItemsTree = z.infer<
  typeof registryResolvedItemsTreeSchema
>
