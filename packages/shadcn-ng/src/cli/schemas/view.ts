import { z } from 'zod'

export const ViewOptionsSchema = z.object({
  component: z.string().min(1),
  cwd: z.string(),
})

export type ViewOptions = z.infer<typeof ViewOptionsSchema>

export interface SourceFile {
  path: string
  content?: string
}

export interface ViewResult {
  component: string
  files: SourceFile[]
}
