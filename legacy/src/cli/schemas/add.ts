import * as v from 'valibot'

export const AddOptionsSchema = v.object({
  components: v.optional(v.array(v.string())),
  yes: v.boolean(),
  overwrite: v.boolean(),
  cwd: v.string(),
  all: v.boolean(),
  path: v.optional(v.string()),
  cssVariables: v.boolean(),
})

export type AddOptions = v.InferOutput<typeof AddOptionsSchema>
