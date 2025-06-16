import type { registryItemTypeSchema } from '~/src/registry/schema'

import path from 'node:path'
import process from 'node:process'

import { Command } from 'commander'
import prompts from 'prompts'
import { z } from 'zod'

import { runInit } from '~/src/commands/init'
import { preFlightAdd } from '~/src/preflights/preflight-add'
import { getRegistryIndex, getRegistryItem, isUrl } from '~/src/registry/api'
import { addComponents } from '~/src/utils/add-components'
import { createProject } from '~/src/utils/create-project'
import * as ERRORS from '~/src/utils/errors'
import { getProjectInfo } from '~/src/utils/get-project-info'
import { handleError } from '~/src/utils/handle-error'
import { highlighter } from '~/src/utils/highlighter'
import { logger } from '~/src/utils/logger'

const DEPRECATED_COMPONENTS: { name: string, deprecatedBy: string, message: string }[] = [
]

export const addOptionsSchema = z.object({
  components: z.array(z.string()).optional(),
  yes: z.boolean(),
  overwrite: z.boolean(),
  cwd: z.string(),
  all: z.boolean(),
  path: z.string().optional(),
  silent: z.boolean(),
  cssVariables: z.boolean(),
})

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
  .option('--css-variables', 'use css variables for theming.', true)
  .option('--no-css-variables', 'do not use css variables for theming.')
  .action(async (components, opts) => {
    try {
      const options = addOptionsSchema.parse({
        components,
        cwd: path.resolve(opts.cwd),
        ...opts,
      })

      let itemType: z.infer<typeof registryItemTypeSchema> | undefined

      if (components.length > 0 && isUrl(components[0])) {
        const item = await getRegistryItem(components[0], '')
        itemType = item?.type
      }

      if (
        !options.yes
        && (itemType === 'registry:style' || itemType === 'registry:theme')
      ) {
        logger.break()
        const { confirm } = await prompts({
          type: 'confirm',
          name: 'confirm',
          message: highlighter.warn(
            `You are about to install a new ${itemType.replace(
              'registry:',
              '',
            )}. \nExisting CSS variables and components will be overwritten. Continue?`,
          ),
        })
        if (!confirm) {
          logger.break()
          logger.log(`Installation cancelled.`)
          logger.break()
          process.exit(1)
        }
      }

      if (!options.components?.length) {
        options.components = await promptForRegistryComponents(options)
      }

      const projectInfo = await getProjectInfo(options.cwd)
      if (projectInfo?.tailwindVersion === 'v4') {
        const deprecatedComponents = DEPRECATED_COMPONENTS.filter(component =>
          options.components?.includes(component.name),
        )

        if (deprecatedComponents?.length) {
          logger.break()
          deprecatedComponents.forEach((component) => {
            logger.warn(highlighter.warn(component.message))
          })
          logger.break()
          process.exit(1)
        }
      }

      let { errors, config } = await preFlightAdd(options)

      // No components.json file. Prompt the user to run init.
      if (errors[ERRORS.MISSING_CONFIG]) {
        const { proceed } = await prompts({
          type: 'confirm',
          name: 'proceed',
          message: `You need to create a ${highlighter.info(
            'components.json',
          )} file to add components. Proceed?`,
          initial: true,
        })

        if (!proceed) {
          logger.break()
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
          cssVariables: options.cssVariables,
          style: 'index',
        })
      }

      if (errors[ERRORS.MISSING_DIR_OR_EMPTY_PROJECT]) {
        const { projectPath } = await createProject({
          cwd: options.cwd,
          force: options.overwrite,
          components: options.components,
        })
        if (!projectPath) {
          logger.break()
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
          cssVariables: options.cssVariables,
          style: 'index',
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
      logger.break()
      handleError(error)
    }
  })

async function promptForRegistryComponents(
  options: z.infer<typeof addOptionsSchema>,
): Promise<string[]> {
  const registryIndex = await getRegistryIndex()
  if (!registryIndex) {
    logger.break()
    handleError(new Error('Failed to fetch registry index.'))
    return []
  }

  if (options.all) {
    return registryIndex
      .map(entry => entry.name)
      .filter(
        component => !DEPRECATED_COMPONENTS.some(c => c.name === component),
      )
  }

  if (options.components?.length) {
    return options.components
  }

  const { components } = await prompts({
    type: 'multiselect',
    name: 'components',
    message: 'Which components would you like to add?',
    hint: 'Space to select. A to toggle all. Enter to submit.',
    instructions: false,
    choices: registryIndex
      .filter(
        entry =>
          entry.type === 'registry:ui'
          && !DEPRECATED_COMPONENTS.some(
            component => component.name === entry.name,
          ),
      )
      .map(entry => ({
        title: entry.name,
        value: entry.name,
        selected: options.all ? true : options.components?.includes(entry.name),
      })),
  })

  if (!components?.length) {
    logger.warn('No components selected. Exiting.')
    logger.info('')
    process.exit(1)
  }

  const result = z.array(z.string()).safeParse(components)
  if (!result.success) {
    logger.error('')
    handleError(new Error('Something went wrong. Please try again.'))
    return []
  }
  return result.data
}
