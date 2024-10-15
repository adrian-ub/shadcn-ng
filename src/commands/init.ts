import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

import * as p from '@clack/prompts'
import { Command } from 'commander'

import { preFlightInit } from '../prefilghts/preflight-init'
import { initOptionsSchema } from '../schemas/init'
import { addComponents } from '../utils/add-components'
import { createProject } from '../utils/create-project'
import * as ERRORS from '../utils/errors'
import { DEFAULT_COMPONENTS, DEFAULT_TAILWIND_CONFIG, DEFAULT_TAILWIND_CSS, DEFAULT_UTILS, getConfig, rawConfigSchema, resolveConfigPaths } from '../utils/get-config'
import { getProjectConfig, getProjectInfo } from '../utils/get-project-info'
import { handleError } from '../utils/handle-error'

import { highlighter } from '../utils/highlighter'
import { getRegistryBaseColors, getRegistryStyles } from '../utils/registry'
import { updateTailwindContent } from '../utils/updaters/update-tailwind-content'
import type { InitOptions } from '../schemas/init'
import type { Config } from '../utils/get-config'

async function promptForMinimalConfig(defaultConfig: Config, opts: InitOptions): Promise<Omit<Config, 'resolvedPaths'>> {
  let style = defaultConfig.style
  let baseColor = defaultConfig.tailwind.baseColor
  let cssVariables = defaultConfig.tailwind.cssVariables

  if (!opts.defaults) {
    const [styles, baseColors] = await Promise.all([
      getRegistryStyles(),
      getRegistryBaseColors(),
    ])

    const options = await p.group({
      style: () => p.select({
        message: `Which ${highlighter.info('style')} would you like to use?`,
        options: styles.map(style => ({
          value: style.name,
          label: style.label,
        })),
        initialValue: styles.find(s => s.name === style)?.name,
      }),
      tailwindBaseColor: () => p.select({
        message: `Which color would you like to use as the ${highlighter.info(
          'base color',
        )}?`,
        options: baseColors.map(color => ({
          label: color.label,
          value: color.name,
        })),
        initialValue: '',
      }),
      tailwindCssVariables: () => p.confirm({
        message: `Would you like to use ${highlighter.info(
          'CSS variables',
        )} for theming?`,
        initialValue: defaultConfig?.tailwind.cssVariables,
      }),
    }, {
      onCancel: () => {
        process.exit(1)
      },
    })

    style = options.style
    baseColor = options.tailwindBaseColor
    cssVariables = options.tailwindCssVariables
  }

  return rawConfigSchema.parse({
    $schema: defaultConfig?.$schema,
    style,
    tailwind: {
      ...defaultConfig?.tailwind,
      config: path.basename(defaultConfig?.tailwind?.config, baseColor),
      cssVariables,
    },
    aliases: defaultConfig?.aliases,
  })
}

async function promptForConfig(defaultConfig: Config | null = null): Promise<Omit<Config, 'resolvedPaths'>> {
  const [styles, baseColors] = await Promise.all([
    getRegistryStyles(),
    getRegistryBaseColors(),
  ])

  const options = await p.group({
    style: () => p.select({
      message: `Which ${highlighter.info('style')} would you like to use?`,
      options: styles.map(style => ({
        label: style.label,
        value: style.name,
      })),
      initialValue: '',
    }),
    tailwindBaseColor: () => p.select({
      message: `Which color would you like to use as the ${highlighter.info(
        'base color',
      )}?`,
      options: baseColors.map(color => ({
        label: color.label,
        value: color.name,
      })),
      initialValue: '',
    }),
    tailwindCss: () => p.text({
      message: `Where is your ${highlighter.info('global CSS')} file?`,
      initialValue: defaultConfig?.tailwind.css ?? DEFAULT_TAILWIND_CSS,
    }),
    tailwindCssVariables: () => p.confirm({
      message: `Would you like to use ${highlighter.info(
        'CSS variables',
      )} for theming?`,
      initialValue: defaultConfig?.tailwind.cssVariables ?? true,
    }),
    tailwindPrefix: () => p.text({
      message: `Are you using a custom ${highlighter.info(
        'tailwind prefix eg. tw-',
      )}? (Leave blank if not)`,
      initialValue: '',
    }),
    tailwindConfig: () => p.text({
      message: `Where is your ${highlighter.info(
        'tailwind.config.js',
      )} located?`,
      initialValue: defaultConfig?.tailwind.config ?? DEFAULT_TAILWIND_CONFIG,
    }),
    components: () => p.text({
      message: `Configure the import alias for ${highlighter.info(
        'components',
      )}:`,
      initialValue: defaultConfig?.aliases.components ?? DEFAULT_COMPONENTS,
    }),
    utils: () => p.text({
      message: `Configure the import alias for ${highlighter.info('utils')}:`,
      initialValue: defaultConfig?.aliases.utils ?? DEFAULT_UTILS,
    }),
  }, {
    onCancel: () => {
      process.exit(1)
    },
  })

  return rawConfigSchema.parse({
    $schema: 'https://ui.adrianub.dev/schema.json',
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
    },
  })
}

export const init = new Command()
  .name('init')
  .description('initialize your project and install dependencies')
  .argument(
    '[components...]',
    'the components to add or a url to the component.',
  )
  .option('-y, --yes', 'skip confirmation prompt.', true)
  .option('-d, --defaults,', 'use default configuration.', false)
  .option('-f, --force', 'force overwrite of existing configuration.', false)
  .option(
    '-c, --cwd <cwd>',
    'the working directory. defaults to the current directory.',
    process.cwd(),
  )
  .option('-s, --silent', 'mute output.', false)
  .action(async (components, opts) => {
    try {
      const options = initOptionsSchema.parse({
        ...opts,
        cwd: path.resolve(opts.cwd),
        isNewProject: false,
        components,
      })

      await runInit(options)
    }
    catch (error) {
      handleError(error)
    }
  })

// eslint-disable-next-line ts/explicit-function-return-type
export async function runInit(
  options: InitOptions & {
    skipPreflight?: boolean
  },
) {
  let projectInfo
  if (!options.skipPreflight) {
    const preflight = await preFlightInit(options)
    if (preflight.errors[ERRORS.MISSING_DIR_OR_EMPTY_PROJECT]) {
      const { projectPath } = await createProject(options)
      if (!projectPath) {
        process.exit(1)
      }
      options.cwd = projectPath
      options.isNewProject = true
    }
    projectInfo = preflight.projectInfo
  }
  else {
    projectInfo = await getProjectInfo(options.cwd)
  }

  const projectConfig = await getProjectConfig(options.cwd, projectInfo)

  const config = projectConfig
    ? await promptForMinimalConfig(projectConfig, options)
    : await promptForConfig(await getConfig(options.cwd))

  if (!options.yes) {
    const { proceed } = await p.group({
      proceed: () =>
        p.confirm({
          message: `Write configuration to ${highlighter.info(
            'components.json',
          )}. Proceed?`,
          initialValue: true,
        }),
    }, {
      onCancel: () => {
        process.exit(1)
      },
    })

    if (!proceed) {
      process.exit(0)
    }
  }

  const componentSpinner = p.spinner()
  componentSpinner.start(`Writing components.json.`)
  const targetPath = path.resolve(options.cwd, 'components.json')
  await fs.writeFile(targetPath, JSON.stringify(config, null, 2), 'utf8')
  componentSpinner.stop(`Wrote components.json.`)

  const fullConfig = await resolveConfigPaths(options.cwd, config)
  const components = ['index', ...(options.components || [])]

  await addComponents(components, fullConfig, {
    // Init will always overwrite files.
    overwrite: true,
    silent: options.silent,
    isNewProject:
      options.isNewProject || projectInfo?.framework.name === 'angular',
  })

  if (options.isNewProject) {
    await updateTailwindContent(
      ['./src/**/*.{html,ts}'],
      fullConfig,
      {
        silent: options.silent,
      },
    )
  }

  return fullConfig
}
