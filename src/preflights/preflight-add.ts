import type { z } from 'zod'
import type { addOptionsSchema } from '~/src/commands/add'
import type { Config } from '~/src/utils/get-config'

import path from 'node:path'
import process from 'node:process'

import fs from 'fs-extra'
import * as ERRORS from '~/src/utils/errors'
import { getConfig } from '~/src/utils/get-config'
import { highlighter } from '~/src/utils/highlighter'
import { logger } from '~/src/utils/logger'

export async function preFlightAdd(options: z.infer<typeof addOptionsSchema>): Promise<
  {
    errors: Record<string, boolean>
    config: Config | null
  }
> {
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
    logger.break()
    logger.error(
      `An invalid ${highlighter.info(
        'components.json',
      )} file was found at ${highlighter.info(
        options.cwd,
      )}.\nBefore you can add components, you must create a valid ${highlighter.info(
        'components.json',
      )} file by running the ${highlighter.info('init')} command.`,
    )
    logger.error(
      `Learn more at ${highlighter.info(
        'https://ui.adrianub.dev/docs/components-json',
      )}.`,
    )
    logger.break()
    process.exit(1)
  }
}
