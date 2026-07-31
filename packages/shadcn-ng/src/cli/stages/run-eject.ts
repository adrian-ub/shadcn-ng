import type { EjectOptions, EjectResult } from '../schemas/eject'

import { existsSync, promises as fs } from 'node:fs'

import path from 'node:path'
import process from 'node:process'

import prompts from 'prompts'

import { z } from 'zod'

import { RegistryResolver } from '../../registry'
import { highlighter } from '../../utils/highlighter'
import { logger } from '../../utils/logger'
import { spinner } from '../../utils/spinner'

import { cancelProcess } from '../utils/cancel-process'
import { ERRORS } from '../utils/errors'
import { preFlightApply } from './preflight-apply'
import { resolveFilePath } from './updaters/update-files'

export async function runEject(options: EjectOptions): Promise<EjectResult> {
  const { errors, config } = await preFlightApply(options.cwd)

  if (errors[ERRORS.MISSING_DIR_OR_EMPTY_PROJECT]) {
    logger.break()
    logger.error(
      `The ${highlighter.info('eject')} command only works in an existing project.`,
    )
    logger.error(`Run ${highlighter.info('init')} first.`)
    logger.break()
    process.exit(1)
  }

  if (errors[ERRORS.MISSING_CONFIG]) {
    logger.break()
    logger.error(
      `No ${highlighter.info('components.json')} found at ${highlighter.info(
        options.cwd,
      )}.`,
    )
    logger.error(`Run ${highlighter.info('init')} first.`)
    logger.break()
    process.exit(1)
  }

  if (!config) {
    throw new Error(
      `Failed to read config at ${highlighter.info(options.cwd)}.`,
    )
  }

  const resolver = new RegistryResolver()
  let components = options.components ?? []

  if (!components.length) {
    components = await promptForEjectComponents(resolver)
  }

  const registrySpinner = spinner('Resolving components from registry.').start()
  const tree = await resolver.resolve(components)
  registrySpinner.succeed(
    `Resolved ${components.length} ${components.length === 1 ? 'component' : 'components'
    } from registry.`,
  )

  // Copy the resolved files as raw, editable source (no transforms).
  const filesEjected: string[] = []
  const filesSkipped: string[] = []

  for (const file of tree.files ?? []) {
    if (!file.content) {
      continue
    }

    const filePath = resolveFilePath(file, config)
    const fileName = path.basename(file.path)
    const targetDir = path.dirname(filePath)

    if (existsSync(filePath) && !options.overwrite && !options.yes) {
      const { value: overwrite } = await prompts({
        type: 'confirm',
        name: 'value',
        message: `The file ${highlighter.info(
          fileName,
        )} already exists. Would you like to overwrite?`,
        initial: false,
      }, { onCancel: () => cancelProcess() })

      if (!overwrite) {
        filesSkipped.push(path.relative(config.resolvedPaths.cwd, filePath))
        continue
      }
    }

    if (!existsSync(targetDir)) {
      await fs.mkdir(targetDir, { recursive: true })
    }

    await fs.writeFile(filePath, file.content, 'utf-8')
    filesEjected.push(path.relative(config.resolvedPaths.cwd, filePath))
  }

  logger.break()
  logger.success(
    `Ejected ${components.length} ${components.length === 1 ? 'component' : 'components'
    } as editable source files.`,
  )
  logger.break()

  return {
    components,
    filesEjected,
    filesSkipped,
  }
}

async function promptForEjectComponents(resolver: RegistryResolver): Promise<string[]> {
  const index = await resolver.getIndex()

  const { value: components } = await prompts({
    type: 'multiselect',
    name: 'value',
    message: 'Which components would you like to eject?',
    choices: index
      .filter(entry => entry.type === 'registry:ui')
      .map(entry => ({
        title: entry.name,
        value: entry.name,
      })),
    instructions: false,
  }, { onCancel: () => cancelProcess() })

  return z.array(z.string()).parse(components)
}
