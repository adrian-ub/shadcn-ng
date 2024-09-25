import { z } from 'astro/zod'

function badgeSchema(): z.ZodObject<{ variant: z.ZodDefault<z.ZodEnum<['note', 'danger', 'success', 'caution', 'tip', 'default']>>, text: z.ZodString, class: z.ZodOptional<z.ZodString> }, 'strip', z.ZodTypeAny, { variant: 'default' | 'note' | 'danger' | 'success' | 'caution' | 'tip', text: string, class?: string | undefined }, { text: string, variant?: 'default' | 'note' | 'danger' | 'success' | 'caution' | 'tip' | undefined, class?: string | undefined }> {
  return z.object({
    variant: z
      .enum(['note', 'danger', 'success', 'caution', 'tip', 'default'])
      .default('default'),
    text: z.string(),
    class: z.string().optional(),
  })
}

export const BadgeComponentSchema = badgeSchema()
  .extend({
    size: z.enum(['small', 'medium', 'large']).default('small'),
  })
  .passthrough()

export type BadgeComponentProps = z.input<typeof BadgeComponentSchema>

export function BadgeConfigSchema(): z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodString, z.ZodObject<{ variant: z.ZodDefault<z.ZodEnum<['note', 'danger', 'success', 'caution', 'tip', 'default']>>, text: z.ZodString, class: z.ZodOptional<z.ZodString> }, 'strip', z.ZodTypeAny, { variant: 'default' | 'note' | 'danger' | 'success' | 'caution' | 'tip', text: string, class?: string | undefined }, { text: string, variant?: 'default' | 'note' | 'danger' | 'success' | 'caution' | 'tip' | undefined, class?: string | undefined }>]>, { variant: 'default' | 'note' | 'danger' | 'success' | 'caution' | 'tip', text: string, class?: string | undefined }, string | { text: string, variant?: 'default' | 'note' | 'danger' | 'success' | 'caution' | 'tip' | undefined, class?: string | undefined }>> {
  return z
    .union([z.string(), badgeSchema()])
    .transform((badge) => {
      if (typeof badge === 'string') {
        return { variant: 'default' as const, text: badge }
      }
      return badge
    })
    .optional()
}

export type Badge = z.output<ReturnType<typeof badgeSchema>>
