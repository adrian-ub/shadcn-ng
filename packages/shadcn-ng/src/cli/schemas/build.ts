import { z } from 'zod'

export const BuildOptionsSchema = z.object({
  cwd: z.string(),
  registryFile: z.string(),
  outputDir: z.string(),
})

export type BuildOptions = z.infer<typeof BuildOptionsSchema>
