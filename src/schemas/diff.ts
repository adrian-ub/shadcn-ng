import { z } from 'zod'

export const updateOptionsSchema = z.object({
  component: z.string().optional(),
  yes: z.boolean(),
  cwd: z.string(),
  path: z.string().optional(),
})

export type UpdateOptions = z.infer<typeof updateOptionsSchema>
