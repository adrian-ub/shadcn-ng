import { z } from 'zod'

// ── RegistryBaseColor ──────────────────────────────────────────────────────

export const registryBaseColorSchema = z.object({
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

export type RegistryBaseColor = z.infer<typeof registryBaseColorSchema>
