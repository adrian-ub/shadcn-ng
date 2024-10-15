import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

import * as p from '@clack/prompts'

import * as ERRORS from '../utils/errors'
import { getProjectInfo } from '../utils/get-project-info'
import { highlighter } from '../utils/highlighter'

import type { InitOptions } from '../schemas/init'
import type { ProjectInfo } from '../utils/get-project-info'

export async function preFlightInit(
  options: InitOptions,
): Promise<{ errors: Record<string, boolean>, projectInfo: ProjectInfo | null }> {
  const errors: Record<string, boolean> = {}

  // Ensure target directory exists.
  // Check for empty project. We assume if no package.json or project.json (nx workspace) exists, the project is empty.
  if (
    !fs.existsSync(options.cwd)
    || (!fs.existsSync(path.resolve(options.cwd, 'package.json')) && !fs.existsSync(path.resolve(options.cwd, 'project.json')))
  ) {
    errors[ERRORS.MISSING_DIR_OR_EMPTY_PROJECT] = true
    return {
      errors,
      projectInfo: null,
    }
  }

  const projectSpinner = p.spinner()
  projectSpinner.start('Preflight checks.')

  if (
    fs.existsSync(path.resolve(options.cwd, 'components.json'))
    && !options.force
  ) {
    projectSpinner.stop(
      `A ${highlighter.info(
        'components.json',
      )} file already exists at ${highlighter.info(
        options.cwd,
      )}.
   To start over, remove the ${highlighter.info(
    'components.json',
  )} file and run ${highlighter.info('init')} again.`,
      3,
    )
    process.exit(1)
  }

  projectSpinner.stop(`Preflight checks.`)

  const frameworkSpinner = p.spinner()
  frameworkSpinner.start('Verifying framework.')

  const projectInfo = await getProjectInfo(options.cwd)

  if (!projectInfo || projectInfo?.framework.name === 'manual') {
    errors[ERRORS.UNSUPPORTED_FRAMEWORK] = true

    if (projectInfo?.framework.links.installation) {
      frameworkSpinner.stop(
        `We could not detect a supported framework at ${highlighter.info(
          options.cwd,
        )}.\n`
        + `Visit ${highlighter.info(
          projectInfo?.framework.links.installation,
        )} to manually configure your project.\nOnce configured, you can use the cli to add components.`,
        3,
      )
    }
    process.exit(1)
  }

  frameworkSpinner.stop(
    `Verifying framework. Found ${highlighter.info(
      projectInfo.framework.label,
    )}.`,
  )

  const tailwindSpinner = p.spinner()
  tailwindSpinner.start('Validating Tailwind CSS.')

  if (!projectInfo?.tailwindConfigFile || !projectInfo?.tailwindCssFile) {
    errors[ERRORS.TAILWIND_NOT_CONFIGURED] = true
    tailwindSpinner.stop(
      `No Tailwind CSS configuration found at ${highlighter.info(
        options.cwd,
      )}. \n   It is likely you do not have Tailwind CSS installed or have an invalid configuration. ${projectInfo?.framework.links.tailwind && `\n   Visit ${highlighter.info(
        projectInfo?.framework.links.tailwind,
      )} to get started.`}
      `,
      3,
    )
  }
  else {
    tailwindSpinner.stop(`Validating Tailwind CSS.`)
  }

  const tsConfigSpinner = p.spinner()
  tsConfigSpinner.start('Validating import alias.')

  if (!projectInfo?.aliasPrefix) {
    errors[ERRORS.IMPORT_ALIAS_MISSING] = true
    tsConfigSpinner.stop(
      `No import alias found in your tsconfig.json file. ${projectInfo?.framework.links.installation
      && `\n   Visit ${highlighter.info(
        projectInfo?.framework.links.installation,
      )} to learn how to set an import alias.`
      }`,
      3,
    )
  }
  else {
    tsConfigSpinner.stop(`Validating import alias.`)
  }

  if (Object.keys(errors).length > 0) {
    process.exit(1)
  }

  return {
    errors,
    projectInfo,
  }
}
