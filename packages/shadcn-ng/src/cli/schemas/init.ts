import * as v from 'valibot'

export const InitSchema = v.object({
  cwd: v.string(),
  components: v.array(v.string()),
  force: v.boolean(),
  defaults: v.boolean(),
  yes: v.boolean(),
  cssVariables: v.boolean(),
})

export type InitOptions = v.InferOutput<typeof InitSchema>
