import { z } from 'zod'

export const InitSchema = z.object({
  cwd: z.string(),
  components: z.array(z.string()),
  force: z.boolean(),
  defaults: z.boolean(),
  yes: z.boolean(),
  cssVariables: z.boolean(),
})

export type InitOptions = z.infer<typeof InitSchema>
