import type { InitOptions } from '../schemas/init'
import type { ProjectInfo } from './get-project-info'

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

import * as p from '@clack/prompts'
import c from 'picocolors'

import { ERRORS } from '../utils/errors'
import { getProjectInfo } from './get-project-info'

export interface PreFlightInitResult {
  errors: Record<string, boolean>
  projectInfo: ProjectInfo | null
}

export async function preFlightInit(options: InitOptions): Promise<PreFlightInitResult> {
  const errors: Record<string, boolean> = {}

  if (
    !fs.existsSync(options.cwd)
    || !fs.existsSync(path.resolve(options.cwd, 'package.json'))
  ) {
    errors[ERRORS.MISSING_DIR_OR_EMPTY_PROJECT] = true
    return {
      errors,
      projectInfo: null,
    }
  }

  if (
    fs.existsSync(path.resolve(options.cwd, 'components.json'))
    && !options.force
  ) {
    p.log.error(
      `A ${c.blue(
        'components.json',
      )} file already exists at ${c.blue(
        options.cwd,
      )}.`,
    )
    p.log.error(`To start over, remove the ${c.blue(
      'components.json',
    )} file and run ${c.blue('init')} again.`)
    process.exit(1)
  }

  const frameworkSpinner = p.spinner()
  frameworkSpinner.start('Verifying framework.')
  const projectInfo = await getProjectInfo(options.cwd)

  if (!projectInfo || projectInfo?.framework.name === 'manual') {
    errors[ERRORS.UNSUPPORTED_FRAMEWORK] = true
    if (projectInfo?.framework.links.installation) {
      p.log.error(
        `We could not detect a supported framework at ${c.blue(
          options.cwd,
        )}.\n`,
      )
      p.log.error(`Visit ${c.blue(
        projectInfo?.framework.links.installation,
      )} to manually configure your project. Once configured, you can use the cli to add components.`)
    }
    process.exit(1)
  }

  frameworkSpinner.stop(`Verifying framework. Found ${c.blue(
    projectInfo.framework.label,
  )}.`)

  if (
    (projectInfo.tailwindVersion === 'v3' && (!projectInfo?.tailwindConfigFile || !projectInfo?.tailwindCssFile))
    || (projectInfo.tailwindVersion === 'v4' && !projectInfo?.tailwindCssFile)
    || !projectInfo.tailwindVersion
  ) {
    errors[ERRORS.TAILWIND_NOT_CONFIGURED] = true

    p.log.error(
      `No Tailwind CSS configuration found at ${c.blue(
        options.cwd,
      )}.`,
    )
    p.log.error(
      `It is likely you do not have Tailwind CSS installed or have an invalid configuration.`,
    )
    p.log.error(`Install Tailwind CSS then try again.`)
    if (projectInfo?.framework.links.tailwind) {
      p.log.error(
        `Visit ${c.blue(
          projectInfo?.framework.links.tailwind,
        )} to get started.`,
      )
    }

    process.exit(1)
  }

  if (!projectInfo?.aliasPrefix) {
    errors[ERRORS.IMPORT_ALIAS_MISSING] = true

    p.log.error(`No import alias found in your tsconfig.json file.`)
    if (projectInfo?.framework.links.installation) {
      p.log.error(
        `Visit ${c.blue(
          projectInfo?.framework.links.installation,
        )} to learn how to set an import alias.`,
      )
    }

    process.exit(1)
  }

  return {
    errors,
    projectInfo,
  }
}
