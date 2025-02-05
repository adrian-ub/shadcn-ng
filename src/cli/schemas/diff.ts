import * as v from 'valibot'

export const DiffOptionsSchema = v.object({
  component: v.optional(v.string()),
  yes: v.boolean(),
  cwd: v.string(),
  path: v.optional(v.string()),
})

export type DiffOptions = v.InferOutput<typeof DiffOptionsSchema>
