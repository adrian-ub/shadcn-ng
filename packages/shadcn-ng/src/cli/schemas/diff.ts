import { z } from 'zod'

export const DiffOptionsSchema = z.object({
  component: z.string().optional(),
  yes: z.boolean(),
  cwd: z.string(),
  path: z.string().optional(),
})

export type DiffOptions = z.infer<typeof DiffOptionsSchema>
