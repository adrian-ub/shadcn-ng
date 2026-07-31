import type { RegistryIndex } from '../../registry/schemas'

import { z } from 'zod'

export const SearchOptionsSchema = z.object({
  query: z.string().optional(),
  cwd: z.string(),
})

export type SearchOptions = z.infer<typeof SearchOptionsSchema>

export interface SearchResult {
  query: string | undefined
  total: number
  items: RegistryIndex
}
