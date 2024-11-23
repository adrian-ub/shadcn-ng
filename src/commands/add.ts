import type { AddOptions } from '../schemas/add'
import path from 'node:path'

import process from 'node:process'
import * as p from '@clack/prompts'
import { Command } from 'commander'

import { z } from 'zod'
import { preFlightAdd } from '../prefilghts/preflight-add'
import { addOptionsSchema } from '../schemas/add'
import { addComponents } from '../utils/add-components'
import { createProject } from '../utils/create-project'
import * as ERRORS from '../utils/errors'
import { handleError } from '../utils/handle-error'
import { highlighter } from '../utils/highlighter'
import { getRegistryIndex } from '../utils/registry'

import { runInit } from './init'

export const add = new Command()
  .name('add')
  .description('add a component to your project')
  .argument(
    '[components...]',
    'the components to add or a url to the component.',
  )
  .option('-y, --yes', 'skip confirmation prompt.', false)
  .option('-o, --overwrite', 'overwrite existing files.', false)
  .option(
    '-c, --cwd <cwd>',
    'the working directory. defaults to the current directory.',
    process.cwd(),
  )
  .option('-a, --all', 'add all available components', false)
  .option('-p, --path <path>', 'the path to add the component to.')
  .option('-s, --silent', 'mute output.', false)
  .action(async (components, opts) => {
    try {
      const options = addOptionsSchema.parse({
        ...opts,
        components,
        cwd: path.resolve(opts.cwd),
      })

      // Confirm if user is installing themes.
      // For now, we assume a theme is prefixed with "theme-".
      const isTheme = options.components?.some(component =>
        component.includes('theme-'),
      )

      if (!options.yes && isTheme) {
        const { confirm } = await p.group({
          confirm: () => p.confirm({
            message: highlighter.warn(
              'You are about to install a new theme. \n   Existing CSS variables will be overwritten. Continue?',
            ),
          }),
        })

        if (!confirm) {
          p.log.error('Theme installation cancelled.')
          process.exit(1)
        }
      }

      if (!options.components?.length) {
        options.components = await promptForRegistryComponents(options)
      }

      let { errors, config } = await preFlightAdd(options)

      if (errors[ERRORS.MISSING_CONFIG]) {
        const { proceed } = await p.group({
          proceed: () => p.confirm({
            message: `You need to create a ${highlighter.info(
              'components.json',
            )} file to add components. Proceed?`,
            initialValue: true,
          }),
        })

        if (!proceed) {
          process.exit(1)
        }

        config = await runInit({
          cwd: options.cwd,
          yes: true,
          force: true,
          defaults: false,
          skipPreflight: false,
          silent: true,
          isNewProject: false,
        })
      }

      if (errors[ERRORS.MISSING_DIR_OR_EMPTY_PROJECT]) {
        const { projectPath } = await createProject({
          cwd: options.cwd,
          force: options.overwrite,
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
          skipPreflight: true,
          silent: true,
          isNewProject: true,
        })
      }

      if (!config) {
        throw new Error(
          `Failed to read config at ${highlighter.info(options.cwd)}.`,
        )
      }

      await addComponents(options.components, config, options)
    }
    catch (error) {
      handleError(error)
    }
  })

async function promptForRegistryComponents(options: AddOptions): Promise<string[]> {
  const registryIndex = await getRegistryIndex()

  if (!registryIndex) {
    handleError(new Error('Failed to fetch registry index.'))
    return []
  }

  if (options.all) {
    return registryIndex.map(entry => entry.name)
  }

  if (options.components?.length) {
    return options.components
  }

  const { components } = await p.group({
    components: () => p.multiselect({
      message: 'Which components would you like to add?',
      options: registryIndex.map(entry => ({
        label: entry.name,
        value: entry.name,
      })),
      initialValues: [] as string[],
    }),
  }, {
    onCancel: () => process.exit(1),
  })

  if (!components?.length) {
    p.log.warn('No components selected. Exiting.')
    process.exit(1)
  }

  const result = z.array(z.string()).safeParse(components)

  if (!result.success) {
    handleError(new Error('Something went wrong. Please try again.'))
    return []
  }

  return result.data
}
