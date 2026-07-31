import { z } from 'zod'

export const DocsOptionsSchema = z.object({
  components: z.array(z.string()).min(1),
  cwd: z.string(),
})

export type DocsOptions = z.infer<typeof DocsOptionsSchema>

export interface DocsResult {
  components: string[]
  urls: string[]
}
