import { z } from 'zod'

export const McpOptionsSchema = z.object({
  cwd: z.string(),
})

export type McpOptions = z.infer<typeof McpOptionsSchema>

export interface McpResult {
  implemented: boolean
  message: string
}
