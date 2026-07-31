import type { Config } from '../../registry'

import fs from 'node:fs'
import path from 'node:path'

import { ERRORS } from '../utils/errors'
import { getConfig } from './get-config'

export interface PreFlightApplyResult {
  errors: Record<string, boolean>
  config: Config | null
}

export async function preFlightApply(cwd: string): Promise<PreFlightApplyResult> {
  const errors: Record<string, boolean> = {}

  // Ensure the target directory exists and the project is not empty.
  // We assume if no package.json exists, the project is empty.
  if (
    !fs.existsSync(cwd)
    || !fs.existsSync(path.resolve(cwd, 'package.json'))
  ) {
    errors[ERRORS.MISSING_DIR_OR_EMPTY_PROJECT] = true
    return {
      errors,
      config: null,
    }
  }

  // The apply command requires an existing project config.
  if (!fs.existsSync(path.resolve(cwd, 'components.json'))) {
    errors[ERRORS.MISSING_CONFIG] = true
    return {
      errors,
      config: null,
    }
  }

  const config = await getConfig(cwd)

  return {
    errors,
    config: config!,
  }
}
