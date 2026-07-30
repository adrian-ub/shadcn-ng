import { z } from 'zod'

// ── Styles ─────────────────────────────────────────────────────────────────

export const stylesSchema = z.array(
  z.object({
    name: z.string(),
    label: z.string(),
  }),
)

export type Styles = z.infer<typeof stylesSchema>

// ── Icons ──────────────────────────────────────────────────────────────────

export const iconsSchema = z.record(
  z.string(),
  z.record(z.string(), z.string()),
)

export type Icons = z.infer<typeof iconsSchema>
