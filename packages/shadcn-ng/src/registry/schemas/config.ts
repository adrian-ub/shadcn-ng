import { z } from 'zod'

// ── RawConfig ──────────────────────────────────────────────────────────────

export const rawConfigSchema = z.object({
  $schema: z.string().optional(),
  style: z.enum(['default', 'new-york']),
  tailwind: z.object({
    config: z.string().optional(),
    css: z.string(),
    baseColor: z.string(),
    cssVariables: z.boolean().optional().default(true),
    prefix: z.string().optional().default(''),
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

export type RawConfig = z.infer<typeof rawConfigSchema>

// ── Config (with resolved paths) ───────────────────────────────────────────

export const configSchema = rawConfigSchema.extend({
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

export type Config = z.infer<typeof configSchema>
