import { z } from 'zod'

export const EjectOptionsSchema = z.object({
  components: z.array(z.string()).optional(),
  yes: z.boolean(),
  overwrite: z.boolean(),
  cwd: z.string(),
})

export type EjectOptions = z.infer<typeof EjectOptionsSchema>

export interface EjectResult {
  components: string[]
  filesEjected: string[]
  filesSkipped: string[]
}
