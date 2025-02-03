import type { Config, RawConfig } from '../../registry/schema'
import type { InitOptions } from '../schemas/init'
import type { ProjectInfo } from './get-project-info'

import fs from 'node:fs/promises'
import path from 'node:path'

import * as p from '@clack/prompts'
import c from 'picocolors'
import * as v from 'valibot'

import { RawConfigSchema } from '../../registry/schema'
import { getRegistryBaseColors, getRegistryStyles } from '../registry'
import { cancelProcess, verifyIsCancelPrompt } from '../utils/cancel-process'
import { ERRORS } from '../utils/errors'
import { addComponents } from './add-components'
import { createProject } from './create-project'
import { $schema, DEFAULT_COMPONENTS, DEFAULT_TAILWIND_CSS, DEFAULT_UTILS, getConfig, resolveConfigPaths } from './get-config'
import { getProjectConfig } from './get-project-info'
import { preFlightInit } from './preflight-init'

export async function runInit(options: InitOptions): Promise<Config> {
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
    const proceed = await p.confirm({
      message: `Write configuration to ${c.blue(
        'components.json',
      )}. Proceed?`,
      initialValue: true,
    })

    verifyIsCancelPrompt(proceed)

    if (!proceed) {
      cancelProcess()
    }
  }

  const targetPath = path.resolve(options.cwd, 'components.json')
  await fs.writeFile(targetPath, JSON.stringify(config, null, 2), 'utf8')
  p.log.success(`${c.blue('components.json')} configuration written.`)

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
    const [styles, baseColors] = await Promise.all([
      getRegistryStyles(),
      getRegistryBaseColors(),
    ])

    const options = await p.group(
      {
        style: () => p.select({
          message: `Which ${c.blue('style')} would you like to use?`,
          options: styles.map(style => ({
            label: style.label,
            value: style.name,
          })),
          initialValue: style,
        }),
        tailwindBaseColor: () => p.select({
          message: `Which color would you like to use as the ${c.blue(
            'base color',
          )}?`,
          options: baseColors.map(color => ({
            label: color.label,
            value: color.name,
          })),
        }),
        tailwindCssVariables: () => p.confirm({
          message: `Would you like to use ${c.blue(
            'CSS variables',
          )} for theming?`,
          initialValue: defaultConfig?.tailwind.cssVariables,
        }),
      },
      {
        onCancel: () => cancelProcess(),
      },
    )

    style = options.style
    baseColor = options.tailwindBaseColor
    cssVariables = options.tailwindCssVariables
  }

  return v.parse(RawConfigSchema, {
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

  const options = await p.group({
    style: () => p.select({
      message: `Which ${c.blue('style')} would you like to use?`,
      options: styles.map(style => ({
        label: style.label,
        value: style.name,
      })),
    }),
    tailwindBaseColor: () => p.select({
      message: `Which color would you like to use as the ${c.blue(
        'base color',
      )}?`,
      options: baseColors.map(color => ({
        label: color.label,
        value: color.name,
      })),
    }),
    tailwindCss: () => p.text({
      message: `Where is your ${c.blue('global CSS')} file?`,
      initialValue: defaultConfig?.tailwind.css ?? DEFAULT_TAILWIND_CSS,
    }),
    tailwindCssVariables: () => p.confirm({
      message: `Would you like to use ${c.blue(
        'CSS variables',
      )} for theming?`,
      initialValue: defaultConfig?.tailwind.cssVariables ?? true,
    }),
    tailwindPrefix: () => p.text({
      message: `Are you using a custom ${c.blue(
        'tailwind prefix eg. tw-',
      )}? (Leave blank if not)`,
      initialValue: defaultConfig?.tailwind.prefix ?? 'tw-',
    }),
    tailwindConfig: () => {
      if (projectInfo?.tailwindVersion === 'v3') {
        return p.text({
          message: `Where is your ${c.blue('tailwind config')} file?`,
          initialValue: defaultConfig?.tailwind.config ?? '',
          placeholder: defaultConfig?.tailwind.config ?? '',
        })
      }

      return Promise.resolve(null)
    },
    components: () => p.text({
      message: `Configure the import alias for ${c.blue(
        'components',
      )}:`,
      initialValue: defaultConfig?.aliases.components ?? DEFAULT_COMPONENTS,
      placeholder: defaultConfig?.aliases.components ?? DEFAULT_COMPONENTS,
    }),
    utils: () => p.text({
      message: `Configure the import alias for ${c.blue('utils')}:`,
      initialValue: defaultConfig?.aliases.utils ?? DEFAULT_UTILS,
    }),
  })

  return v.parse(RawConfigSchema, {
    $schema,
    style: options.style,
    tailwind: {
      config: options.tailwindConfig,
      css: options.tailwindCss,
      baseColor: options.tailwindBaseColor,
      cssVariables: options.tailwindCssVariables,
      prefix: options.tailwindPrefix,
    },
    aliases: {
      utils: options.utils,
      components: options.components,
      // TODO: fix this.
      lib: options.components.replace(/\/components$/, 'lib'),
      services: options.components.replace(/\/components$/, 'services'),
    },
  })
}
