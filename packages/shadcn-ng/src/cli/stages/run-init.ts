import type { Config, RawConfig } from '../../registry/schema'
import type { InitOptions } from '../schemas/init'
import type { ProjectInfo } from './get-project-info'

import fs from 'node:fs/promises'
import path from 'node:path'

import prompts from 'prompts'

import { highlighter } from '../../utils/highlighter'
import { logger } from '../../utils/logger'
import { z } from 'zod'

import { RawConfigSchema } from '../../registry/schema'
import { getRegistryBaseColors, getRegistryStyles } from '../registry'
import { cancelProcess } from '../utils/cancel-process'
import { ERRORS } from '../utils/errors'
import { addComponents } from './add-components'
import { createProject } from './create-project'
import { $schema, DEFAULT_COMPONENTS, DEFAULT_TAILWIND_CSS, DEFAULT_UTILS, getConfig, resolveConfigPaths } from './get-config'
import { getProjectConfig, getProjectTailwindVersionFromConfig } from './get-project-info'
import { preFlightInit } from './preflight-init'
import { resolveTemplate } from './resolve-template'

export async function runInit(options: InitOptions): Promise<Config> {
  options.template = await resolveTemplate(options.template, {
    defaults: options.defaults,
  })
  logger.info(`Using the ${highlighter.info(options.template)} template.`)

  const preflight = await preFlightInit(options)

  if (preflight.errors[ERRORS.MISSING_DIR_OR_EMPTY_PROJECT]) {
    const { projectPath } = await createProject(options)

    options.cwd = projectPath
  }

  const projectInfo = preflight.projectInfo

  const projectConfig = await getProjectConfig(options.cwd, projectInfo)

  const config = projectConfig
    ? await promptForMinimalConfig(projectConfig, options)
    : await promptForConfig(await getConfig(options.cwd), projectInfo)

  if (!options.yes) {
    const { value: proceed } = await prompts({
      type: 'confirm',
      name: 'value',
      message: `Write configuration to ${highlighter.info(
        'components.json',
      )}. Proceed?`,
      initial: true,
    }, { onCancel: () => cancelProcess() })

    if (!proceed) {
      cancelProcess()
    }
  }

  const targetPath = path.resolve(options.cwd, 'components.json')
  await fs.writeFile(targetPath, JSON.stringify(config, null, 2), 'utf8')
  logger.success(`${highlighter.info('components.json')} configuration written.`)

  const fullConfig = await resolveConfigPaths(options.cwd, config)
  const components = ['index', ...(options.components || [])]
  await addComponents(components, fullConfig, {
    // Init will always overwrite files.
    overwrite: true,
  })

  return fullConfig
}

async function promptForMinimalConfig(
  defaultConfig: Config,
  opts: InitOptions,
): Promise<RawConfig> {
  let style: string = defaultConfig.style
  let baseColor = defaultConfig.tailwind.baseColor
  let cssVariables = defaultConfig.tailwind.cssVariables

  if (!opts.defaults) {
    const [styles, baseColors, tailwindVersion] = await Promise.all([
      getRegistryStyles(),
      getRegistryBaseColors(),
      getProjectTailwindVersionFromConfig(defaultConfig),
    ])

    let styleResult: { value: string } = { value: 'new-york' }
    if (tailwindVersion !== 'v4') {
      styleResult = await prompts({
        type: 'select',
        name: 'value',
        message: `Which ${highlighter.info('style')} would you like to use?`,
        choices: styles.map(s => ({
          title: s.label,
          value: s.name,
          description: s.name === 'new-york' ? 'Recommended' : undefined,
        })),
        initial: style,
      }, { onCancel: () => cancelProcess() })
    }

    const tailwindBaseColorResult = await prompts({
      type: 'select',
      name: 'value',
      message: `Which color would you like to use as the ${highlighter.info('base color')}?`,
      choices: baseColors.map(color => ({
        title: color.label,
        value: color.name,
      })),
    }, { onCancel: () => cancelProcess() })

    style = styleResult.value ?? 'new-york'
    baseColor = tailwindBaseColorResult.value
    cssVariables = opts.cssVariables
  }

  return RawConfigSchema.parse({
    $schema: defaultConfig?.$schema,
    style,
    tailwind: {
      ...defaultConfig?.tailwind,
      baseColor,
      cssVariables,
    },
    aliases: defaultConfig?.aliases,
    iconLibrary: defaultConfig?.iconLibrary,
  })
}

async function promptForConfig(defaultConfig: Config | null = null, projectInfo: ProjectInfo | null = null): Promise<RawConfig> {
  const [styles, baseColors] = await Promise.all([
    getRegistryStyles(),
    getRegistryBaseColors(),
  ])

  const styleResult = await prompts({
    type: 'select',
    name: 'value',
    message: `Which ${highlighter.info('style')} would you like to use?`,
    choices: styles.map(s => ({
      title: s.label,
      value: s.name,
    })),
  }, { onCancel: () => cancelProcess() })

  const tailwindBaseColorResult = await prompts({
    type: 'select',
    name: 'value',
    message: `Which color would you like to use as the ${highlighter.info('base color')}?`,
    choices: baseColors.map(color => ({
      title: color.label,
      value: color.name,
    })),
  }, { onCancel: () => cancelProcess() })

  const tailwindCssResult = await prompts({
    type: 'text',
    name: 'value',
    message: `Where is your ${highlighter.info('global CSS')} file?`,
    initial: defaultConfig?.tailwind.css ?? DEFAULT_TAILWIND_CSS,
  }, { onCancel: () => cancelProcess() })

  const tailwindCssVariablesResult = await prompts({
    type: 'confirm',
    name: 'value',
    message: `Would you like to use ${highlighter.info('CSS variables')} for theming?`,
    initial: defaultConfig?.tailwind.cssVariables ?? true,
  }, { onCancel: () => cancelProcess() })

  const tailwindPrefixResult = await prompts({
    type: 'text',
    name: 'value',
    message: `Are you using a custom ${highlighter.info('tailwind prefix eg. tw-')}? (Leave blank if not)`,
    initial: defaultConfig?.tailwind.prefix ?? 'tw-',
  }, { onCancel: () => cancelProcess() })

  let tailwindConfigResult: { value: string | null } = { value: null }
  if (projectInfo?.tailwindVersion === 'v3') {
    tailwindConfigResult = await prompts({
      type: 'text',
      name: 'value',
      message: `Where is your ${highlighter.info('tailwind config')} file?`,
      initial: defaultConfig?.tailwind.config ?? '',
    }, { onCancel: () => cancelProcess() })
  }

  const componentsResult = await prompts({
    type: 'text',
    name: 'value',
    message: `Configure the import alias for ${highlighter.info('components')}:`,
    initial: defaultConfig?.aliases.components ?? DEFAULT_COMPONENTS,
  }, { onCancel: () => cancelProcess() })

  const utilsResult = await prompts({
    type: 'text',
    name: 'value',
    message: `Configure the import alias for ${highlighter.info('utils')}:`,
    initial: defaultConfig?.aliases.utils ?? DEFAULT_UTILS,
  }, { onCancel: () => cancelProcess() })

  const components = componentsResult.value as string

  return RawConfigSchema.parse({
    $schema,
    style: styleResult.value,
    tailwind: {
      config: tailwindConfigResult.value,
      css: tailwindCssResult.value,
      baseColor: tailwindBaseColorResult.value,
      cssVariables: tailwindCssVariablesResult.value,
      prefix: tailwindPrefixResult.value,
    },
    aliases: {
      utils: utilsResult.value as string,
      components,
      // TODO: fix this.
      lib: components.replace(/\/components$/, 'lib'),
      services: components.replace(/\/components$/, 'services'),
    },
  })
}
