import type { Change } from 'diff'
import type * as v from 'valibot'
import type { Config, RegistryIndexSchema } from '../../registry'
import type { DiffOptions } from '../schemas/diff'

import { existsSync, promises as fs } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

import * as p from '@clack/prompts'
import { diffLines } from 'diff'
import c from 'picocolors'

import { handleError } from '../../utils/handle-error'
import { fetchTree, getRegistryBaseColor, getRegistryIndex } from '../registry'
import { getConfig } from './get-config'
import { transform } from './transformers'
import { resolveFilePath } from './updaters/update-files'

export async function runDiff(options: DiffOptions): Promise<void> {
  const cwd = path.resolve(options.cwd)

  if (!existsSync(cwd)) {
    p.log.error(`The path ${cwd} does not exist. Please try again.`)
    process.exit(1)
  }

  const config = await getConfig(cwd)
  if (!config) {
    p.log.warn(
      `Configuration is missing. Please run ${c.green(
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
    // Find all components that exist in the project.
    const projectComponents = registryIndex.filter((item) => {
      for (const file of item.files ?? []) {
        const filePath = resolveFilePath(file, config)
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
      p.log.step(`- ${component.name}`)
      for (const change of component.changes) {
        p.log.step(`  - ${change.filePath}`)
      }
    }

    p.log.info(
      `Run ${c.green(`diff <component>`)} to see the changes.`,
    )
    process.exit(0)
  }

  // Show diff for a single component.
  const component = registryIndex.find(
    item => item.name === options.component,
  )

  if (!component) {
    p.log.error(
      `The component ${c.green(
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
    p.log.step(`- ${change.filePath}`)
    await printDiff(change.patch)
  }
}

async function diffComponent(
  component: v.InferOutput<typeof RegistryIndexSchema>[number],
  config: Config,
): Promise<{ filePath: string, patch: Change[] }[]> {
  const payload = await fetchTree(config.style, [component])
  const baseColor = await getRegistryBaseColor(config.tailwind.baseColor)

  if (!payload) {
    return []
  }

  const changes = []

  for (const item of payload) {
    for (const file of item.files ?? []) {
      const filePath = resolveFilePath(file, config)

      if (!existsSync(filePath)) {
        continue
      }

      const fileContent = await fs.readFile(filePath, 'utf8')

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
        return process.stdout.write(c.green(part.value))
      }
      if (part.removed) {
        return process.stdout.write(c.red(part.value))
      }

      return process.stdout.write(part.value)
    }
  })
}
