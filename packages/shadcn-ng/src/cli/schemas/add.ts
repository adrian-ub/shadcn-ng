import { z } from 'zod'

export const AddOptionsSchema = z.object({
  components: z.array(z.string()).optional(),
  yes: z.boolean(),
  overwrite: z.boolean(),
  cwd: z.string(),
  all: z.boolean(),
  path: z.string().optional(),
  cssVariables: z.boolean(),
})

export type AddOptions = z.infer<typeof AddOptionsSchema>
