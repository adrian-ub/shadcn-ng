import type { ApplyOptions, ApplyResult } from '../schemas/apply'

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
import { updateDependencies } from './updaters/update-dependencies'
import { updateFiles } from './updaters/update-files'

export async function runApply(options: ApplyOptions): Promise<ApplyResult> {
  const { errors, config } = await preFlightApply(options.cwd)

  if (errors[ERRORS.MISSING_DIR_OR_EMPTY_PROJECT]) {
    logger.break()
    logger.error(
      `The ${highlighter.info('apply')} command only works in an existing project.`,
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
    components = await promptForApplyComponents(resolver)
  }

  const registrySpinner = spinner('Resolving components from registry.').start()
  const tree = await resolver.resolve(components)
  registrySpinner.succeed(
    `Resolved ${components.length} ${components.length === 1 ? 'component' : 'components'
    } from registry.`,
  )

  const result = await updateFiles(tree.files, config, {
    overwrite: options.overwrite,
  })

  await updateDependencies(tree.dependencies, config)

  logger.break()
  logger.success(
    `Applied ${components.length} ${components.length === 1 ? 'component' : 'components'
    } to ${highlighter.info(config.resolvedPaths.cwd)}.`,
  )
  logger.break()

  return {
    components,
    ...result,
  }
}

async function promptForApplyComponents(resolver: RegistryResolver): Promise<string[]> {
  const index = await resolver.getIndex()

  const { value: components } = await prompts({
    type: 'multiselect',
    name: 'value',
    message: 'Which components would you like to apply?',
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
