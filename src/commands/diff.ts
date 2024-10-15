import fs, { existsSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

import * as p from '@clack/prompts'
import { Command } from 'commander'
import { diffLines } from 'diff'
import type { Change } from 'diff'
import type { z } from 'zod'

import { updateOptionsSchema } from '../schemas/diff'
import { getConfig } from '../utils/get-config'
import { handleError } from '../utils/handle-error'
import { highlighter } from '../utils/highlighter'
import { fetchTree, getItemTargetPath, getRegistryBaseColor, getRegistryIndex } from '../utils/registry'
import { transform } from '../utils/transformers'
import type { Config } from '../utils/get-config'
import type { registryIndexSchema } from '../utils/registry/schema'

export const diff = new Command()
  .name('diff')
  .description('check for updates against the registry')
  .argument('[component]', 'the component name')
  .option('-y, --yes', 'skip confirmation prompt.', false)
  .option(
    '-c, --cwd <cwd>',
    'the working directory. defaults to the current directory.',
    process.cwd(),
  )
  .action(async (name, opts) => {
    const options = updateOptionsSchema.parse({
      ...opts,
      component: name,
    })

    const cwd = path.resolve(options.cwd)

    if (!existsSync(cwd)) {
      p.log.error(`The path ${cwd} does not exist. Please try again.`)
      process.exit(1)
    }

    const config = await getConfig(cwd)

    if (!config) {
      p.log.warn(
        `Configuration is missing. Please run ${highlighter.success(
          `init`,
        )} to create a components.json file.`,
      )
      process.exit(1)
    }

    const registryIndex = await getRegistryIndex()

    if (!registryIndex) {
      handleError(new Error('Failed to fetch registry index.'))
      process.exit(1)
    }

    if (!options.component) {
      const targetDir = config.resolvedPaths.components

      // Find all components that exist in the project.
      const projectComponents = registryIndex.filter((item) => {
        for (const file of item.files ?? []) {
          const filePath = path.resolve(
            targetDir,
            typeof file === 'string' ? file : file.path,
          )

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
        p.log.info('No updates found.')
        process.exit(0)
      }

      p.log.info('The following components have updates available:')

      for (const component of componentsWithUpdates) {
        p.log.info(`- ${component.name}`)
        for (const change of component.changes) {
          p.log.info(`  - ${change.filePath}`)
        }
      }

      p.log.info(
        `Run ${highlighter.success(`diff <component>`)} to see the changes.`,
      )
      process.exit(0)
    }

    // Show diff for a single component.
    const component = registryIndex.find(
      item => item.name === options.component,
    )

    if (!component) {
      p.log.error(
        `The component ${highlighter.success(
          options.component,
        )} does not exist.`,
      )
      process.exit(1)
    }

    const changes = await diffComponent(component, config)

    if (!changes.length) {
      p.log.info(`No updates found for ${options.component}.`)
      process.exit(0)
    }

    for (const change of changes) {
      p.log.info(`- ${change.filePath}`)
      await printDiff(change.patch)
    }
  })

async function diffComponent(
  component: z.infer<typeof registryIndexSchema>[number],
  config: Config,
): Promise<{
    filePath: string
    patch: Change[]
  }[]> {
  const payload = await fetchTree(config.style, [component])
  const baseColor = await getRegistryBaseColor(config.tailwind.baseColor)

  if (!payload) {
    return []
  }

  const changes = []

  for (const item of payload) {
    const targetDir = await getItemTargetPath(config, item)

    if (!targetDir) {
      continue
    }

    for (const file of item.files ?? []) {
      const filePath = path.resolve(
        // TODO: Why is it necessary to replace it?
        targetDir.replace('/ui', ''),
        typeof file === 'string' ? file : file.path,
      )

      if (!existsSync(filePath)) {
        continue
      }

      const fileContent = fs.readFileSync(filePath, 'utf8')

      if (typeof file === 'string' || !file.content) {
        continue
      }

      const registryContent = await transform({
        filename: file.path,
        raw: file.content,
        config,
        baseColor,
      })

      const patch = diffLines(registryContent as string, fileContent)
      if (patch.length > 1) {
        changes.push({
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
        return process.stdout.write(highlighter.success(part.value))
      }
      if (part.removed) {
        return process.stdout.write(highlighter.error(part.value))
      }

      return process.stdout.write(part.value)
    }
  })
}
