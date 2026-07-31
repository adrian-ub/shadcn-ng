import type { Change } from 'diff'
import { z } from 'zod'
import type { Config, RegistryIndexSchema } from '../../registry'
import type { DiffOptions } from '../schemas/diff'

import { existsSync, promises as fs } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

import { diffLines } from 'diff'

import { highlighter } from '../../utils/highlighter'
import { logger } from '../../utils/logger'

import { handleError } from '../../utils/handle-error'
import { fetchTree, getRegistryBaseColor, getRegistryIndex } from '../registry'
import { getConfig } from './get-config'
import { transform } from './transformers'
import { resolveFilePath } from './updaters/update-files'

export async function runDiff(options: DiffOptions): Promise<void> {
  const cwd = path.resolve(options.cwd)

  if (!existsSync(cwd)) {
    logger.error(`The path ${cwd} does not exist. Please try again.`)
    process.exit(1)
  }

  const config = await getConfig(cwd)
  if (!config) {
    logger.warn(
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
    // Find all components that exist in the project.
    const projectComponents = registryIndex.filter((item) => {
      for (const file of item.files ?? []) {
        const filePath = resolveFilePath(file, config, {
          path: options.path,
        })
        if (existsSync(filePath)) {
          return true
        }
      }

      return false
    })

    // Check for updates.
    const componentsWithUpdates = []
    for (const component of projectComponents) {
      const changes = await diffComponent(component, config, options)
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
      logger.log(`- ${component.name}`)
      for (const change of component.changes) {
        logger.log(`  - ${change.filePath}`)
      }
    }

    logger.info(
      `Run ${highlighter.success(`diff <component>`)} to see the changes.`,
    )
    process.exit(0)
  }

  // Show diff for a single component.
  const component = registryIndex.find(
    item => item.name === options.component,
  )

  if (!component) {
    logger.error(
      `The component ${highlighter.success(
        options.component,
      )} does not exist.`,
    )
    process.exit(1)
  }

  const changes = await diffComponent(component, config, options)

  if (!changes.length) {
    logger.info(`No updates found for ${options.component}.`)
    process.exit(0)
  }

  for (const change of changes) {
    logger.log(`- ${change.filePath}`)
    await printDiff(change.patch)
  }
}

async function diffComponent(
  component: z.infer<typeof RegistryIndexSchema>[number],
  config: Config,
  options: DiffOptions,
): Promise<{ filePath: string, patch: Change[] }[]> {
  const payload = await fetchTree(config.style, [component])
  const baseColor = await getRegistryBaseColor(config.tailwind.baseColor)

  if (!payload) {
    return []
  }

  const changes = []

  for (const item of payload) {
    for (const file of item.files ?? []) {
      const filePath = resolveFilePath(file, config, { path: options.path })

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
  process.stdout.write(formatDiffLines(diff))
}

/**
 * Renders a diff as a unified output: added lines prefixed with `+ `,
 * removed lines with `- `, and context lines indented by two spaces.
 * Added and removed lines are colored via the highlighter.
 */
export function formatDiffLines(diff: Change[]): string {
  const lines: string[] = []

  for (const part of diff) {
    if (!part) {
      continue
    }

    const body = part.value.split('\n')
    if (body[body.length - 1] === '') {
      body.pop()
    }

    for (const line of body) {
      if (part.added) {
        lines.push(highlighter.success(`+ ${line}`))
      }
      else if (part.removed) {
        lines.push(highlighter.error(`- ${line}`))
      }
      else {
        lines.push(`  ${line}`)
      }
    }
  }

  return lines.length ? `${lines.join('\n')}\n` : ''
}
