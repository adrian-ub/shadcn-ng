import { z } from 'zod'

export const ApplyOptionsSchema = z.object({
  components: z.array(z.string()).optional(),
  yes: z.boolean(),
  overwrite: z.boolean(),
  cwd: z.string(),
})

export type ApplyOptions = z.infer<typeof ApplyOptionsSchema>

export interface ApplyResult {
  components: string[]
  filesCreated: string[]
  filesUpdated: string[]
  filesSkipped: string[]
}
