import * as v from 'valibot'

export const BuildOptionsSchema = v.object({
  cwd: v.string(),
  registryFile: v.string(),
  outputDir: v.string(),
})

export type BuildOptions = v.InferOutput<typeof BuildOptionsSchema>
