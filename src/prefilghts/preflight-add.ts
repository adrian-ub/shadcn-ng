import type { AddOptions } from '../schemas/add'
import fs from 'node:fs'
import path from 'node:path'

import process from 'node:process'

import * as p from '@clack/prompts'
import * as ERRORS from '../utils/errors'
import { getConfig } from '../utils/get-config'
import { highlighter } from '../utils/highlighter'

export async function preFlightAdd(options: AddOptions): Promise<{ errors: Record<string, boolean>, config: any | null }> {
  const errors: Record<string, boolean> = {}

  // Ensure target directory exists.
  // Check for empty project. We assume if no package.json exists, the project is empty.
  if (
    !fs.existsSync(options.cwd)
    || !fs.existsSync(path.resolve(options.cwd, 'package.json'))
  ) {
    errors[ERRORS.MISSING_DIR_OR_EMPTY_PROJECT] = true
    return {
      errors,
      config: null,
    }
  }

  // Check for existing components.json file.
  if (!fs.existsSync(path.resolve(options.cwd, 'components.json'))) {
    errors[ERRORS.MISSING_CONFIG] = true
    return {
      errors,
      config: null,
    }
  }

  try {
    const config = await getConfig(options.cwd)

    return {
      errors,
      config: config!,
    }
  }
  catch {
    p.log.error(
      `An invalid ${highlighter.info(
        'components.json',
      )} file was found at ${highlighter.info(
        options.cwd,
      )}.\nBefore you can add components, you must create a valid ${highlighter.info(
        'components.json',
      )} file by running the ${highlighter.info('init')} command.`,
    )
    p.log.error(
      `Learn more at ${highlighter.info(
        'https://ui.adrianub.dev/docs/components-json',
      )}.`,
    )
    process.exit(1)
  }
}
