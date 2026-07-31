import { z } from 'zod'

export const PresetApplyOptionsSchema = z.object({
  name: z.string().min(1),
  yes: z.boolean(),
  overwrite: z.boolean(),
  cwd: z.string(),
})

export type PresetApplyOptions = z.infer<typeof PresetApplyOptionsSchema>

export interface PresetApplyResult {
  name: string
  components: string[]
  filesCreated: string[]
  filesUpdated: string[]
  filesSkipped: string[]
}
