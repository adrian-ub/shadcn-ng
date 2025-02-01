import * as v from 'valibot'

export const RegistryItemTypeSchema = v.picklist([
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

export const RegistryItemFileSchema = v.variant('type', [
  v.object({
    path: v.string(),
    content: v.optional(v.string()),
    type: v.picklist(['registry:file', 'registry:page']),
    target: v.string(),
  }),
  v.object({
    path: v.string(),
    content: v.optional(v.string()),
    type: v.pipe(
      RegistryItemTypeSchema,
      v.excludes('registry:file'),
      v.excludes('registry:page'),
    ),
    target: v.string(),
  }),
])

export const RegistryItemTailwindSchema = v.object({
  config: v.optional(
    v.object({
      plugins: v.optional(v.array(v.string())),
      theme: v.optional(v.record(v.string(), v.any())),
    }),
  ),
})

export const RegistryItemCssVarsSchema = v.object({
  light: v.optional(v.record(v.string(), v.string())),
  dark: v.optional(v.record(v.string(), v.string())),
})

export const RegistryItemSchema = v.object({
  $schema: v.optional(v.string()),
  name: v.string(),
  type: RegistryItemTypeSchema,
  title: v.optional(v.string()),
  author: v.optional(v.pipe(v.string(), v.minLength(2))),
  description: v.optional(v.string()),
  dependencies: v.optional(v.array(v.string())),
  devDependencies: v.optional(v.array(v.string())),
  registryDependencies: v.optional(v.array(v.string())),
  files: v.optional(v.array(RegistryItemFileSchema)),
  tailwind: v.optional(RegistryItemTailwindSchema),
  cssVars: v.optional(RegistryItemCssVarsSchema),
  meta: v.optional(v.record(v.string(), v.any())),
  docs: v.optional(v.string()),
})

export type RegistryItem = v.InferOutput<typeof RegistryItemSchema>

export const RegistrySchema = v.object({
  name: v.string(),
  homepage: v.string(),
  items: v.array(RegistryItemSchema),
})

export type Registry = v.InferOutput<typeof RegistrySchema>

export const RegistryIndexSchema = v.array(RegistryItemSchema)

export const StylesSchema = v.array(
  v.object({
    name: v.string(),
    label: v.string(),
  }),
)

export const IconsSchema = v.record(
  v.string(),
  v.record(v.string(), v.string()),
)

export const RegistryBaseColorSchema = v.object({
  inlineColors: v.object({
    light: v.record(v.string(), v.string()),
    dark: v.record(v.string(), v.string()),
  }),
  cssVars: v.object({
    light: v.record(v.string(), v.string()),
    dark: v.record(v.string(), v.string()),
  }),
  inlineColorsTemplate: v.string(),
  cssVarsTemplate: v.string(),
})

export const RegistryResolvedItemsTreeSchema = v.pick(
  RegistryItemSchema,
  [
    'dependencies',
    'devDependencies',
    'files',
    'tailwind',
    'cssVars',
    'docs',
  ],
)

export const RawConfigSchema = v.object({
  $schema: v.optional(v.string()),
  style: v.string(),
  tailwind: v.object({
    config: v.optional(v.string()),
    css: v.string(),
    baseColor: v.string(),
    cssVariables: v.optional(v.boolean(), true),
    prefix: v.optional(v.string(), ''),
  }),
  aliases: v.object({
    components: v.string(),
    utils: v.string(),
    ui: v.optional(v.string()),
    lib: v.optional(v.string()),
    services: v.optional(v.string()),
  }),
  iconLibrary: v.optional(v.string()),
})

export type RawConfig = v.InferOutput<typeof RawConfigSchema>

export const ConfigSchema = v.object({
  ...RawConfigSchema.entries,
  resolvedPaths: v.object({
    cwd: v.string(),
    tailwindConfig: v.string(),
    tailwindCss: v.string(),
    utils: v.string(),
    components: v.string(),
    lib: v.string(),
    services: v.string(),
    ui: v.string(),
  }),
})

export type Config = v.InferOutput<typeof ConfigSchema>
