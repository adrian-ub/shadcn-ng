import type { RawConfig } from '../../registry/schemas/config'

import { z } from 'zod'

export const MigrateOptionsSchema = z.object({
  path: z.string().optional(),
  cwd: z.string(),
  dryRun: z.boolean(),
})

export type MigrateOptions = z.infer<typeof MigrateOptionsSchema>

export interface MigrateResult {
  path: string
  dryRun: boolean
  written: boolean
  changes: string[]
  config: RawConfig
}
