import { existsSync, promises as fs } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

import chalk from 'chalk'
import { defineCommand } from 'citty'
import { execa } from 'execa'
import ora from 'ora'
import prompts from 'prompts'
import { z } from 'zod'

import { getConfig } from '../utils/get-config'
import { getPackageManager } from '../utils/get-package-manager'
import { handleError } from '../utils/handle-error'
import { logger } from '../utils/logger'
import {
  fetchTree,
  getItemTargetPath,
  getRegistryBaseColor,
  getRegistryIndex,
  resolveTree,
} from '../utils/registry'
import { transform } from '../utils/transformers'

const addOptionsSchema = z.object({
  components: z.array(z.string()).optional(),
  yes: z.boolean(),
  overwrite: z.boolean(),
  cwd: z.string(),
  all: z.boolean(),
  path: z.string().optional(),
})

export const add = defineCommand({
  meta: {
    description: 'add a component to your project',
  },
  args: {
    components: {
      type: 'positional',
      description: 'the components to add',
      required: true,
    },
    yes: {
      type: 'boolean',
      description: 'skip confirmation prompt.',
      default: true,
      alias: 'y',
    },
    overwrite: {
      type: 'boolean',
      description: 'overwrite existing files.',
      default: false,
      alias: 'o',
    },
    cwd: {
      type: 'string',
      description: 'the working directory. defaults to the current directory.',
      default: process.cwd(),
      alias: 'c',
    },
    all: {
      type: 'boolean',
      description: 'add all available components',
      default: false,
      alias: 'a',
    },
    path: {
      type: 'string',
      description: 'the path to add the component to.',
      alias: 'p',
    },
  },
  run: async ({ args: opts }) => {
    const { _: components } = opts
    try {
      const options = addOptionsSchema.parse({
        ...opts,
        components,
      })

      const cwd = path.resolve(options.cwd)

      if (!existsSync(cwd)) {
        logger.error(`The path ${cwd} does not exist. Please try again.`)
        process.exit(1)
      }

      const config = await getConfig(cwd)
      if (!config) {
        logger.warn(
          `Configuration is missing. Please run ${chalk.green(
            `init`,
          )} to create a components.json file.`,
        )
        process.exit(1)
      }

      const registryIndex = await getRegistryIndex()

      let selectedComponents = options.all
        ? registryIndex.map((entry: any) => entry.name)
        : options.components
      if (!options.components?.length && !options.all) {
        const { components } = await prompts({
          type: 'multiselect',
          name: 'components',
          message: 'Which components would you like to add?',
          hint: 'Space to select. A to toggle all. Enter to submit.',
          instructions: false,
          choices: registryIndex.map((entry: any) => ({
            title: entry.name,
            value: entry.name,
            selected: options.all
              ? true
              : options.components?.includes(entry.name),
          })),
        })
        selectedComponents = components
      }

      if (!selectedComponents?.length) {
        logger.warn('No components selected. Exiting.')
        process.exit(0)
      }

      const tree = await resolveTree(registryIndex, selectedComponents)
      const payload = await fetchTree(config.style, tree)
      const baseColor = await getRegistryBaseColor(config.tailwind.baseColor)

      if (!payload.length) {
        logger.warn('Selected components not found. Exiting.')
        process.exit(0)
      }

      if (!options.yes) {
        const { proceed } = await prompts({
          type: 'confirm',
          name: 'proceed',
          message: `Ready to install components and dependencies. Proceed?`,
          initial: true,
        })

        if (!proceed) {
          process.exit(0)
        }
      }

      const spinner = ora(`Installing components...`).start()
      for (const item of payload) {
        spinner.text = `Installing ${item.name}...`
        const targetDir = await getItemTargetPath(
          config,
          item,
          options.path ? path.resolve(cwd, options.path) : undefined,
        )

        if (!targetDir) {
          continue
        }

        if (!existsSync(targetDir)) {
          await fs.mkdir(targetDir, { recursive: true })
        }

        const existingComponent = item.files.filter((file: any) =>
          existsSync(path.resolve(targetDir, file.name)),
        )

        if (existingComponent.length && !options.overwrite) {
          if (selectedComponents.includes(item.name)) {
            spinner.stop()
            const { overwrite } = await prompts({
              type: 'confirm',
              name: 'overwrite',
              message: `Component ${item.name} already exists. Would you like to overwrite?`,
              initial: false,
            })

            if (!overwrite) {
              logger.info(
                `Skipped ${item.name}. To overwrite, run with the ${chalk.green(
                  '--overwrite',
                )} flag.`,
              )
              continue
            }

            spinner.start(`Installing ${item.name}...`)
          }
          else {
            continue
          }
        }

        for (const file of item.files) {
          const filePath = path.resolve(targetDir, file.name)

          // Run transformers.
          const content = await transform({
            filename: file.name,
            raw: file.content,
            config,
            baseColor,
          })

          await fs.writeFile(filePath, content)
        }

        const packageManager = await getPackageManager(cwd)

        // Install dependencies.
        if (item.dependencies?.length) {
          await execa(
            packageManager,
            [
              packageManager === 'npm' ? 'install' : 'add',
              ...item.dependencies,
            ],
            {
              cwd,
            },
          )
        }

        // Install devDependencies.
        if (item.devDependencies?.length) {
          await execa(
            packageManager,
            [
              packageManager === 'npm' ? 'install' : 'add',
              '-D',
              ...item.devDependencies,
            ],
            {
              cwd,
            },
          )
        }
      }
      spinner.succeed(`Done.`)
    }
    catch (error) {
      handleError(error)
    }
  },
})
