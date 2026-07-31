import { z } from 'zod'

export const RegistryItemTypeSchema = z.enum([
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

export const RegistryItemFileSchema = z.discriminatedUnion('type', [
  z.object({
    path: z.string(),
    content: z.string().optional(),
    type: z.enum(['registry:file', 'registry:page']),
    target: z.string(),
  }),
  z.object({
    path: z.string(),
    content: z.string().optional(),
    type: RegistryItemTypeSchema
      .exclude(['registry:file', 'registry:page']),
    target: z.string().optional(),
  }),
])

export const RegistryItemTailwindSchema = z.object({
  config: z
    .object({
      plugins: z.array(z.string()).optional(),
      theme: z.record(z.string(), z.any()).optional(),
    })
    .optional(),
})

export const RegistryItemCssVarsSchema = z.object({
  light: z.record(z.string(), z.string()).optional(),
  dark: z.record(z.string(), z.string()).optional(),
})

export const RegistryItemSchema = z.object({
  $schema: z.string().optional(),
  name: z.string(),
  type: RegistryItemTypeSchema,
  title: z.string().optional(),
  author: z.string().min(2).optional(),
  description: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  devDependencies: z.array(z.string()).optional(),
  registryDependencies: z.array(z.string()).optional(),
  files: z.array(RegistryItemFileSchema).optional(),
  tailwind: RegistryItemTailwindSchema.optional(),
  cssVars: RegistryItemCssVarsSchema.optional(),
  meta: z.record(z.string(), z.any()).optional(),
  docs: z.string().optional(),
  categories: z.array(z.string()).optional(),
})

export type RegistryItem = z.infer<typeof RegistryItemSchema>

export const RegistrySchema = z.object({
  name: z.string(),
  homepage: z.string(),
  items: z.array(RegistryItemSchema),
})

export type Registry = z.infer<typeof RegistrySchema>

export const RegistryIndexSchema = z.array(RegistryItemSchema)

export const StylesSchema = z.array(
  z.object({
    name: z.string(),
    label: z.string(),
  }),
)

export const IconsSchema = z.record(
  z.string(),
  z.record(z.string(), z.string()),
)

export const RegistryBaseColorSchema = z.object({
  inlineColors: z.object({
    light: z.record(z.string(), z.string()),
    dark: z.record(z.string(), z.string()),
  }),
  cssVars: z.object({
    light: z.record(z.string(), z.string()),
    dark: z.record(z.string(), z.string()),
  }),
  cssVarsV4: z
    .object({
      light: z.record(z.string(), z.string()),
      dark: z.record(z.string(), z.string()),
    })
    .optional(),
  inlineColorsTemplate: z.string(),
  cssVarsTemplate: z.string(),
})

export const RegistryResolvedItemsTreeSchema = RegistryItemSchema.pick({
  dependencies: true,
  devDependencies: true,
  files: true,
  tailwind: true,
  cssVars: true,
  docs: true,
})

export const RawConfigSchema = z.object({
  $schema: z.string().optional(),
  style: z.enum(['default', 'new-york']),
  tailwind: z.object({
    config: z.string().optional(),
    css: z.string(),
    baseColor: z.string(),
    cssVariables: z.boolean().default(true),
    prefix: z.string().default(''),
  }),
  aliases: z.object({
    components: z.string(),
    utils: z.string(),
    ui: z.string().optional(),
    lib: z.string().optional(),
    services: z.string().optional(),
  }),
  iconLibrary: z.string().optional(),
})

export type RawConfig = z.infer<typeof RawConfigSchema>

export const ConfigSchema = z.object({
  ...RawConfigSchema.shape,
  resolvedPaths: z.object({
    cwd: z.string(),
    tailwindConfig: z.string(),
    tailwindCss: z.string(),
    utils: z.string(),
    components: z.string(),
    lib: z.string(),
    services: z.string(),
    ui: z.string(),
  }),
})

export type Config = z.infer<typeof ConfigSchema>
