import type { PresetApplyOptions, PresetApplyResult } from '../schemas/preset'

import process from 'node:process'

import { RegistryResolver } from '../../registry'
import { highlighter } from '../../utils/highlighter'
import { logger } from '../../utils/logger'
import { spinner } from '../../utils/spinner'

import { ERRORS } from '../utils/errors'
import { preFlightApply } from './preflight-apply'
import { updateDependencies } from './updaters/update-dependencies'
import { updateFiles } from './updaters/update-files'

export interface Preset {
  name: string
  description: string
  components: string[]
}

export const PRESETS: Preset[] = [
  {
    name: 'starter',
    description:
      'Core UI primitives for new projects: button, card, input, label, badge.',
    components: ['button', 'card', 'input', 'label', 'badge'],
  },
  {
    name: 'forms',
    description:
      'Form controls and validation: input, label, select, checkbox, textarea.',
    components: ['input', 'label', 'select', 'checkbox', 'textarea'],
  },
  {
    name: 'dashboard',
    description:
      'Data-dense layouts: card, table, badge, avatar, separator, skeleton.',
    components: ['card', 'table', 'badge', 'avatar', 'separator', 'skeleton'],
  },
]

export function resolvePreset(name: string): Preset {
  const resolved = PRESETS.find(preset => preset.name === name)

  if (!resolved) {
    throw new Error(
      `Unknown preset "${name}". Available presets: ${PRESETS.map(preset => preset.name).join(', ')}.`,
    )
  }

  return resolved
}

export async function runPresetList(): Promise<Preset[]> {
  logger.break()
  logger.log('Available presets:')
  for (const preset of PRESETS) {
    logger.log(`  - ${highlighter.info(preset.name)}: ${preset.description}`)
  }
  logger.break()

  return PRESETS
}

export async function runPresetApply(
  options: PresetApplyOptions,
): Promise<PresetApplyResult> {
  const { errors, config } = await preFlightApply(options.cwd)

  if (errors[ERRORS.MISSING_DIR_OR_EMPTY_PROJECT]) {
    logger.break()
    logger.error(
      `The ${highlighter.info('preset apply')} command only works in an existing project.`,
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

  const preset = resolvePreset(options.name)

  const resolver = new RegistryResolver()

  const registrySpinner = spinner(
    `Resolving preset "${preset.name}" from registry.`,
  ).start()
  const tree = await resolver.resolve(preset.components)
  registrySpinner.succeed(
    `Resolved ${preset.components.length} components for preset "${preset.name}".`,
  )

  const result = await updateFiles(tree.files, config, {
    overwrite: options.overwrite,
  })

  await updateDependencies(tree.dependencies, config)

  logger.break()
  logger.success(
    `Applied preset "${preset.name}" (${preset.components.length} components) to ${highlighter.info(config.resolvedPaths.cwd)}.`,
  )
  logger.break()

  return {
    name: preset.name,
    components: preset.components,
    ...result,
  }
}
