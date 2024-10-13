import { existsSync, promises as fs } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

import { Command } from 'commander'
import { consola } from 'consola'
import { execa } from 'execa'
import template from 'lodash.template'
import ora from 'ora'
import pc from 'picocolors'

import { z } from 'zod'
import {
  type Config,
  DEFAULT_COMPONENTS,
  DEFAULT_TAILWIND_CONFIG,
  DEFAULT_TAILWIND_CSS,
  DEFAULT_UTILS,
  getConfig,
  rawConfigSchema,
  resolveConfigPaths,
} from '../utils/get-config'
import { getPackageManager } from '../utils/get-package-manager'
import { getProjectConfig, preFlight } from '../utils/get-project-info'
import { handleError } from '../utils/handle-error'
import { logger } from '../utils/logger'
import {
  getRegistryBaseColor,
  getRegistryBaseColors,
  getRegistryStyles,
} from '../utils/registry'

import * as templates from '../utils/templates'
import { applyPrefixesCss } from '../utils/transformers/transform-tw-prefix'

const PROJECT_DEPENDENCIES = [
  'tailwindcss-animate',
  'class-variance-authority',
  'clsx',
  'tailwind-merge',
]

const initOptionsSchema = z.object({
  cwd: z.string(),
  yes: z.boolean(),
  defaults: z.boolean(),
})

export const init = new Command()
  .name('init')
  .description('initialize your project and install dependencies')
  .option('-y, --yes', 'skip confirmation prompt.', false)
  .option('-d, --defaults,', 'use default configuration.', false)
  .option(
    '-c, --cwd <cwd>',
    'the working directory. defaults to the current directory.',
    process.cwd(),
  )
  .action(async (opts) => {
    try {
      const options = initOptionsSchema.parse(opts)
      const cwd = path.resolve(options.cwd)

      // Ensure target directory exists.
      if (!existsSync(cwd)) {
        logger.error(`The path ${cwd} does not exist. Please try again.`)
        process.exit(1)
      }

      preFlight(cwd)

      const projectConfig = await getProjectConfig(cwd)
      if (projectConfig) {
        const config = await promptForMinimalConfig(
          cwd,
          projectConfig,
          opts.defaults,
        )
        await runInit(cwd, config)
      }
      else {
        // Read config.
        const existingConfig = await getConfig(cwd)
        const config = await promptForConfig(cwd, existingConfig, options.yes)
        await runInit(cwd, config)
      }

      logger.info('')
      logger.info(
        `${pc.green(
          'Success!',
        )} Project initialization completed. You may now add components.`,
      )
      logger.info('')
    }
    catch (error) {
      handleError(error)
    }
  })

export async function promptForConfig(
  cwd: string,
  defaultConfig: Config | null = null,
  skip = false,
): Promise<{ style: string, tailwind: { config: string, css: string, baseColor: string, cssVariables: boolean, prefix?: string | undefined }, aliases: { components: string, utils: string, ui?: string | undefined }, resolvedPaths: { components: string, utils: string, ui: string, tailwindConfig: string, tailwindCss: string }, $schema?: string | undefined }> {
  const highlight = (text: string): string => pc.cyan(text)

  const styles = await getRegistryStyles()
  const baseColors = await getRegistryBaseColors()

  const style = await consola.prompt(`Which ${highlight('style')} would you like to use?`, {
    type: 'select',
    options: styles.map(style => ({
      label: style.label,
      value: style.name,
    })),
  })

  const tailwindBaseColor = await consola.prompt(`Which color would you like to use as ${highlight(
    'base color',
  )}?`, {
    type: 'select',
    options: baseColors.map(color => ({
      label: color.label,
      value: color.name,
    })),
  })

  const tailwindCss = await consola.prompt(`Where is your ${highlight('global CSS')} file?`, {
    type: 'text',
    initial: defaultConfig?.tailwind.css ?? DEFAULT_TAILWIND_CSS,
  })

  const tailwindCssVariables = await consola.prompt(`Would you like to use ${highlight(
    'CSS variables',
  )} for colors?`, {
    type: 'confirm',
    initial: defaultConfig?.tailwind.cssVariables ?? true,
  })

  const tailwindPrefix = await consola.prompt(`Are you using a custom ${highlight(
    'tailwind prefix eg. tw-',
  )}? (Leave blank if not)`, {
    type: 'text',
  })

  const tailwindConfig = await consola.prompt(`Where is your ${highlight('tailwind.config.js')} located?`, {
    type: 'text',
    initial: defaultConfig?.tailwind.config ?? DEFAULT_TAILWIND_CONFIG,
  })

  const components = await consola.prompt(`Configure the import alias for ${highlight('components')}:`, {
    type: 'text',
    initial: defaultConfig?.aliases.components ?? DEFAULT_COMPONENTS,
  })

  const utils = await consola.prompt(`Configure the import alias for ${highlight('utils')}:`, {
    type: 'text',
    initial: defaultConfig?.aliases.utils ?? DEFAULT_UTILS,
  })

  const options = {
    style,
    tailwindConfig,
    tailwindCss,
    tailwindBaseColor,
    tailwindCssVariables,
    tailwindPrefix,
    components,
    utils,
  }

  const config = rawConfigSchema.parse({
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
    },
  })

  if (!skip) {
    const proceed = await consola.prompt(`Write configuration to ${highlight(
      'components.json',
    )}. Proceed?`, {
      type: 'confirm',
      name: 'proceed',
      initial: true,
    })

    if (!proceed) {
      process.exit(0)
    }
  }

  // Write to file.
  logger.info('')
  const spinner = ora(`Writing components.json...`).start()
  const targetPath = path.resolve(cwd, 'components.json')
  await fs.writeFile(targetPath, JSON.stringify(config, null, 2), 'utf8')
  spinner.succeed()

  return await resolveConfigPaths(cwd, config)
}

export async function promptForMinimalConfig(
  cwd: string,
  defaultConfig: Config,
  defaults = false,
): Promise<{ style: string, tailwind: { config: string, css: string, baseColor: string, cssVariables: boolean, prefix?: string | undefined }, aliases: { components: string, utils: string, ui?: string | undefined }, resolvedPaths: { components: string, utils: string, ui: string, tailwindConfig: string, tailwindCss: string }, $schema?: string | undefined }> {
  const highlight = (text: string): string => pc.cyan(text)
  let style = defaultConfig.style
  let baseColor = defaultConfig.tailwind.baseColor
  let cssVariables = defaultConfig.tailwind.cssVariables

  if (!defaults) {
    const styles = await getRegistryStyles()
    const baseColors = await getRegistryBaseColors()

    const styleSelect = await consola.prompt(`Which ${highlight('style')} would you like to use?`, {
      type: 'select',
      options: styles.map((style: any) => ({
        label: style.label,
        value: style.name,
      })),
    })

    const tailwindBaseColor = await consola.prompt(`Which color would you like to use as ${highlight(
      'base color',
    )}?`, {
      type: 'select',
      options: baseColors.map(color => ({
        label: color.label,
        value: color.name,
      })),
    })

    const tailwindCssVariables = await consola.prompt(`Would you like to use ${highlight(
      'CSS variables',
    )} for colors?`, {
      type: 'confirm',
      initial: defaultConfig?.tailwind.cssVariables ?? true,
    })

    const options = {
      styleSelect,
      tailwindBaseColor,
      tailwindCssVariables,
    }

    style = options.styleSelect.value
    baseColor = options.tailwindBaseColor.value
    cssVariables = options.tailwindCssVariables
  }

  const config = rawConfigSchema.parse({
    $schema: defaultConfig?.$schema,
    style,
    tailwind: {
      ...defaultConfig?.tailwind,
      baseColor,
      cssVariables,
    },
    aliases: defaultConfig?.aliases,
  })

  // Write to file.
  logger.info('')
  const spinner = ora(`Writing components.json...`).start()
  const targetPath = path.resolve(cwd, 'components.json')
  await fs.writeFile(targetPath, JSON.stringify(config, null, 2), 'utf8')
  spinner.succeed()

  return await resolveConfigPaths(cwd, config)
}

export async function runInit(cwd: string, config: Config): Promise<void> {
  const spinner = ora(`Initializing project...`)?.start()

  // Ensure all resolved paths directories exist.
  for (const [key, resolvedPath] of Object.entries(config.resolvedPaths)) {
    // Determine if the path is a file or directory.
    // TODO: is there a better way to do this?
    let dirname = path.extname(resolvedPath)
      ? path.dirname(resolvedPath)
      : resolvedPath

    // If the utils alias is set to something like "@/lib/utils",
    // assume this is a file and remove the "utils" file name.
    // TODO: In future releases we should add support for individual utils.
    if (key === 'utils' && resolvedPath.endsWith('/utils')) {
      // Remove /utils at the end.
      dirname = dirname.replace(/\/utils$/, '')
    }

    if (!existsSync(dirname)) {
      await fs.mkdir(dirname, { recursive: true })
    }
  }

  //   const extension = "ts";

  const tailwindConfigExtension = path.extname(
    config.resolvedPaths.tailwindConfig,
  )

  let tailwindConfigTemplate: string
  if (tailwindConfigExtension === '.ts') {
    tailwindConfigTemplate = config.tailwind.cssVariables
      ? templates.TAILWIND_CONFIG_TS_WITH_VARIABLES
      : templates.TAILWIND_CONFIG_TS
  }
  else {
    tailwindConfigTemplate = config.tailwind.cssVariables
      ? templates.TAILWIND_CONFIG_WITH_VARIABLES
      : templates.TAILWIND_CONFIG
  }

  // Write tailwind config.
  await fs.writeFile(
    config.resolvedPaths.tailwindConfig,
    template(tailwindConfigTemplate)({
      prefix: config.tailwind.prefix,
    }),
    'utf8',
  )

  // Write css file.
  const baseColor = await getRegistryBaseColor(config.tailwind.baseColor)
  if (baseColor) {
    await fs.writeFile(
      config.resolvedPaths.tailwindCss,
      config.tailwind.cssVariables
        ? config.tailwind.prefix
          ? applyPrefixesCss(baseColor.cssVarsTemplate, config.tailwind.prefix)
          : baseColor.cssVarsTemplate
        : baseColor.inlineColorsTemplate,
      'utf8',
    )
  }

  // Write cn file.
  await fs.writeFile(
    `${config.resolvedPaths.utils}.ts`,
    templates.UTILS,
    'utf8',
  )

  spinner?.succeed()

  // Install dependencies.
  const dependenciesSpinner = ora(`Installing dependencies...`)?.start()
  const packageManager = await getPackageManager(cwd)

  // TODO: add support for other icon libraries.
  const deps = [...PROJECT_DEPENDENCIES]

  await execa(
    packageManager,
    [packageManager === 'npm' ? 'install' : 'add', ...deps],
    {
      cwd,
    },
  )
  dependenciesSpinner?.succeed()
}
