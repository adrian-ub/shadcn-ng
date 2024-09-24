import { existsSync, promises as fs } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

import { defineCommand } from 'citty'
import { execa } from 'execa'
import template from 'lodash.template'
import ora from 'ora'
import pc from 'picocolors'
import prompts from 'prompts'
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

export const init = defineCommand({
  meta: {
    description: 'initialize your project and install dependencies',
  },
  args: {
    yes: {
      type: 'boolean',
      description: 'skip confirmation prompt.',
      default: false,
      alias: 'y',
    },
    defaults: {
      type: 'boolean',
      description: 'use default configuration.',
      default: false,
      alias: 'd',
    },
    cwd: {
      type: 'string',
      description: 'the working directory. defaults to the current directory.',
      default: process.cwd(),
      alias: 'c',
    },
  },
  run: async ({ args: opts }) => {
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
  },
})

export async function promptForConfig(
  cwd: string,
  defaultConfig: Config | null = null,
  skip = false,
): Promise<{ style: string, tailwind: { config: string, css: string, baseColor: string, cssVariables: boolean, prefix?: string | undefined }, aliases: { components: string, utils: string, ui?: string | undefined }, resolvedPaths: { components: string, utils: string, ui: string, tailwindConfig: string, tailwindCss: string }, $schema?: string | undefined }> {
  const highlight = (text: string): string => pc.cyan(text)

  const styles = await getRegistryStyles()
  const baseColors = await getRegistryBaseColors()

  const options = await prompts([
    {
      type: 'select',
      name: 'style',
      message: `Which ${highlight('style')} would you like to use?`,
      choices: styles.map((style: any) => ({
        title: style.label,
        value: style.name,
      })),
    },
    {
      type: 'select',
      name: 'tailwindBaseColor',
      message: `Which color would you like to use as ${highlight(
        'base color',
      )}?`,
      choices: baseColors.map(color => ({
        title: color.label,
        value: color.name,
      })),
    },
    {
      type: 'text',
      name: 'tailwindCss',
      message: `Where is your ${highlight('global CSS')} file?`,
      initial: defaultConfig?.tailwind.css ?? DEFAULT_TAILWIND_CSS,
    },
    {
      type: 'toggle',
      name: 'tailwindCssVariables',
      message: `Would you like to use ${highlight(
        'CSS variables',
      )} for colors?`,
      initial: defaultConfig?.tailwind.cssVariables ?? true,
      active: 'yes',
      inactive: 'no',
    },
    {
      type: 'text',
      name: 'tailwindPrefix',
      message: `Are you using a custom ${highlight(
        'tailwind prefix eg. tw-',
      )}? (Leave blank if not)`,
      initial: '',
    },
    {
      type: 'text',
      name: 'tailwindConfig',
      message: `Where is your ${highlight('tailwind.config.js')} located?`,
      initial: defaultConfig?.tailwind.config ?? DEFAULT_TAILWIND_CONFIG,
    },
    {
      type: 'text',
      name: 'components',
      message: `Configure the import alias for ${highlight('components')}:`,
      initial: defaultConfig?.aliases.components ?? DEFAULT_COMPONENTS,
    },
    {
      type: 'text',
      name: 'utils',
      message: `Configure the import alias for ${highlight('utils')}:`,
      initial: defaultConfig?.aliases.utils ?? DEFAULT_UTILS,
    },
  ])

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
    const { proceed } = await prompts({
      type: 'confirm',
      name: 'proceed',
      message: `Write configuration to ${highlight(
        'components.json',
      )}. Proceed?`,
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

    const options = await prompts([
      {
        type: 'select',
        name: 'style',
        message: `Which ${highlight('style')} would you like to use?`,
        choices: styles.map((style: any) => ({
          title: style.label,
          value: style.name,
        })),
      },
      {
        type: 'select',
        name: 'tailwindBaseColor',
        message: `Which color would you like to use as ${highlight(
          'base color',
        )}?`,
        choices: baseColors.map(color => ({
          title: color.label,
          value: color.name,
        })),
      },
      {
        type: 'toggle',
        name: 'tailwindCssVariables',
        message: `Would you like to use ${highlight(
          'CSS variables',
        )} for colors?`,
        initial: defaultConfig?.tailwind.cssVariables,
        active: 'yes',
        inactive: 'no',
      },
    ])

    style = options.style
    baseColor = options.tailwindBaseColor
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
