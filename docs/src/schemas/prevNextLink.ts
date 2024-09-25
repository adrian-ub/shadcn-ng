import { z } from 'astro/zod'

export function PrevNextLinkConfigSchema(): z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodString, z.ZodObject<{
  /** The navigation link URL. */
  link: z.ZodOptional<z.ZodString>
  /** The navigation link text. */
  label: z.ZodOptional<z.ZodString>
}, 'strict', z.ZodTypeAny, { link?: string | undefined, label?: string | undefined }, { link?: string | undefined, label?: string | undefined }>]>> {
  return z
    .union([
      z.boolean(),
      z.string(),
      z
        .object({
          /** The navigation link URL. */
          link: z.string().optional(),
          /** The navigation link text. */
          label: z.string().optional(),
        })
        .strict(),
    ])
    .optional()
}

export type PrevNextLinkUserConfig = z.input<
  ReturnType<typeof PrevNextLinkConfigSchema>
>
export type PrevNextLinkConfig = z.output<
  ReturnType<typeof PrevNextLinkConfigSchema>
>
