import { existsSync, promises as fs } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

import { defineCommand } from 'citty'
import { type Change, diffLines } from 'diff'
import pc from 'picocolors'
import { z } from 'zod'

import { getConfig } from '../utils/get-config'
import { handleError } from '../utils/handle-error'
import { logger } from '../utils/logger'
import {
  fetchTree,
  getItemTargetPath,
  getRegistryBaseColor,
  getRegistryIndex,
} from '../utils/registry'
import { transform } from '../utils/transformers'
import type { Config } from '../utils/get-config'
import type { registryIndexSchema } from '../utils/registry/schema'

const updateOptionsSchema = z.object({
  component: z.string().optional(),
  yes: z.boolean(),
  cwd: z.string(),
  path: z.string().optional(),
})

export const diff = defineCommand({
  meta: {
    description: 'check for updates against the registry',
  },
  args: {
    component: {
      type: 'positional',
      description: 'the component name',
      required: false,
    },
    yes: {
      type: 'boolean',
      description: 'skip confirmation prompt.',
      default: false,
      alias: 'y',
    },
    cwd: {
      type: 'string',
      description: 'the working directory. defaults to the current directory.',
      default: process.cwd(),
      alias: 'c',
    },
  },
  run: async ({ args: opts }) => {
    try {
      const options = updateOptionsSchema.parse({
        ...opts,
      })

      const cwd = path.resolve(options.cwd)

      if (!existsSync(cwd)) {
        logger.error(`The path ${cwd} does not exist. Please try again.`)
        process.exit(1)
      }

      const config = await getConfig(cwd)
      if (!config) {
        logger.warn(
          `Configuration is missing. Please run ${pc.green(
            `init`,
          )} to create a components.json file.`,
        )
        process.exit(1)
      }

      const registryIndex = await getRegistryIndex()

      if (!options.component) {
        const targetDir = config.resolvedPaths.components

        // Find all components that exist in the project.
        const projectComponents = registryIndex.filter((item: any) => {
          for (const file of item.files) {
            const filePath = path.resolve(targetDir, file)
            if (existsSync(filePath)) {
              return true
            }
          }

          return false
        })

        // Check for updates.
        const componentsWithUpdates = []
        for (const component of projectComponents) {
          const changes = await diffComponent(component, config)
          if (changes.length) {
            componentsWithUpdates.push({
              name: component.name,
              changes,
            })
          }
        }

        if (!componentsWithUpdates.length) {
          logger.info('No updates found.')
          process.exit(0)
        }

        logger.info('The following components have updates available:')
        for (const component of componentsWithUpdates) {
          logger.info(`- ${component.name}`)
          for (const change of component.changes) {
            logger.info(`  - ${change.filePath}`)
          }
        }
        logger.break()
        logger.info(
          `Run ${pc.green(`diff <component>`)} to see the changes.`,
        )
        process.exit(0)
      }

      // Show diff for a single component.
      const component = registryIndex.find(
        (item: any) => item.name === options.component,
      )

      if (!component) {
        logger.error(
          `The component ${pc.green(options.component)} does not exist.`,
        )
        process.exit(1)
      }

      const changes = await diffComponent(component, config)

      if (!changes.length) {
        logger.info(`No updates found for ${options.component}.`)
        process.exit(0)
      }

      for (const change of changes) {
        logger.info(`- ${change.filePath}`)
        await printDiff(change.patch)
        logger.info('')
      }
    }
    catch (error) {
      handleError(error)
    }
  },
})

async function diffComponent(
  component: z.infer<typeof registryIndexSchema>[number],
  config: Config,
): Promise<{ file: any, filePath: string, patch: Change[] }[]> {
  const payload = await fetchTree(config.style, [component])
  const baseColor = await getRegistryBaseColor(config.tailwind.baseColor)

  const changes = []

  for (const item of payload) {
    const targetDir = await getItemTargetPath(config, item)

    if (!targetDir) {
      continue
    }

    for (const file of item.files) {
      const filePath = path.resolve(targetDir, file.name)

      if (!existsSync(filePath)) {
        continue
      }

      const fileContent = await fs.readFile(filePath, 'utf8')

      const registryContent = await transform({
        filename: file.name,
        raw: file.content,
        config,
        baseColor,
      })

      const patch = diffLines(registryContent as string, fileContent)
      if (patch.length > 1) {
        changes.push({
          file: file.name,
          filePath,
          patch,
        })
      }
    }
  }

  return changes
}

async function printDiff(diff: Change[]): Promise<void> {
  diff.forEach((part) => {
    if (part) {
      if (part.added) {
        return process.stdout.write(pc.green(part.value))
      }
      if (part.removed) {
        return process.stdout.write(pc.red(part.value))
      }

      return process.stdout.write(part.value)
    }
  })
}
