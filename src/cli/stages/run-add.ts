import type { AddOptions } from '../schemas/add'

import process from 'node:process'

import * as p from '@clack/prompts'
import c from 'picocolors'

import { promptForRegistryComponents } from '../stages/prompt-for-registry-components'
import { cancelProcess, verifyIsCancelPrompt } from '../utils/cancel-process'
import { ERRORS } from '../utils/errors'
import { addComponents } from './add-components'
import { createProject } from './create-project'
import { preFlightAdd } from './preflight-add'
import { runInit } from './run-init'

export async function runAdd(options: AddOptions): Promise<void> {
  // Confirm if user is installing themes.
  // For now, we assume a theme is prefixed with "theme-".
  const isTheme = options.components?.some(component =>
    component.includes('theme-'),
  )

  if (!options.yes && isTheme) {
    const confirm = await p.confirm({
      message: c.yellow(
        'You are about to install a new theme. Existing CSS variables will be overwritten. Continue?',
      ),
    })

    verifyIsCancelPrompt(confirm)

    if (!confirm) {
      cancelProcess()
    }
  }

  if (!options.components?.length) {
    options.components = await promptForRegistryComponents(options)
  }

  let { errors, config } = await preFlightAdd(options)

  // No components.json file. Prompt the user to run init.
  if (errors[ERRORS.MISSING_CONFIG]) {
    const proceed = await p.confirm({
      message: `You need to create a ${c.blue('components.json')} file to add components. Proceed?`,
      initialValue: true,
    })

    verifyIsCancelPrompt(proceed)

    if (!proceed) {
      process.exit(1)
    }

    config = await runInit({
      cwd: options.cwd,
      yes: true,
      force: true,
      defaults: false,
      components: [],
    })
  }

  if (errors[ERRORS.MISSING_DIR_OR_EMPTY_PROJECT]) {
    const { projectPath } = await createProject({
      cwd: options.cwd,
      force: options.overwrite,
      components: options.components,
      defaults: false,
      yes: true,
    })

    if (!projectPath) {
      process.exit(1)
    }

    options.cwd = projectPath

    config = await runInit({
      cwd: options.cwd,
      yes: true,
      force: true,
      defaults: false,
      components: [],
    })
  }

  if (!config) {
    throw new Error(
      `Failed to read config at ${c.blue(options.cwd)}.`,
    )
  }

  await addComponents(options.components, config, options)
}
