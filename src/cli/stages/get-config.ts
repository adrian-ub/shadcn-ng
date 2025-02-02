import type { Config, RawConfig } from '../../registry/schema'

import path from 'node:path'

import c from 'picocolors'
import { loadConfig as loadTsConfigPaths } from 'tsconfig-paths'
import { loadConfig } from 'unconfig'
import * as v from 'valibot'

import { ConfigSchema, RawConfigSchema } from '../../registry/schema'
import { resolveImport } from './resolve-import'

export const DEFAULT_STYLE = 'default'
export const DEFAULT_COMPONENTS = '~/components'
export const DEFAULT_UTILS = '~/lib/utils'
export const DEFAULT_TAILWIND_CSS = 'src/styles.css'
export const DEFAULT_TAILWIND_CONFIG = 'tailwind.config.js'
export const DEFAULT_TAILWIND_BASE_COLOR = 'slate'
export const $schema = 'https://ui.adrianub.dev/schema.json'

export async function getConfig(cwd: string): Promise<Config | null> {
  const config = await getRawConfig(cwd)

  if (!config) {
    return null
  }

  // Set default icon library if not provided.
  if (!config.iconLibrary) {
    config.iconLibrary = config.style === 'new-york' ? 'radix' : 'lucide'
  }

  return await resolveConfigPaths(cwd, config)
}

export async function getRawConfig(cwd: string): Promise<RawConfig | null> {
  try {
    const configResult = await loadConfig({
      cwd,
      sources: [
        {
          files: 'components',
          extensions: ['json'],
        },
      ],
    })

    if (!configResult || !configResult.sources?.length) {
      return null
    }

    return v.parse(RawConfigSchema, configResult.config)
  }
  catch {
    const componentPath = `${cwd}/components.json`
    throw new Error(
      `Invalid configuration found in ${c.blue(componentPath)}.`,
    )
  }
}

export async function resolveConfigPaths(cwd: string, config: RawConfig): Promise<Config> {
  // Read tsconfig.json.
  const tsConfig = await loadTsConfigPaths(cwd)

  if (tsConfig.resultType === 'failed') {
    throw new Error(
      `Failed to load tsconfig.json. ${tsConfig.message ?? ''
      }`.trim(),
    )
  }

  return v.parse(ConfigSchema, {
    ...config,
    resolvedPaths: {
      cwd,
      tailwindConfig: config.tailwind.config
        ? path.resolve(cwd, config.tailwind.config)
        : '',
      tailwindCss: path.resolve(cwd, config.tailwind.css),
      utils: await resolveImport(config.aliases.utils, tsConfig),
      components: await resolveImport(config.aliases.components, tsConfig),
      ui: config.aliases.ui
        ? await resolveImport(config.aliases.ui, tsConfig)
        : path.resolve(
            (await resolveImport(config.aliases.components, tsConfig))
            ?? cwd,
            'ui',
          ),
      // TODO: Make this configurable.
      // For now, we assume the lib and hooks directories are one level up from the components directory.
      lib: config.aliases.lib
        ? await resolveImport(config.aliases.lib, tsConfig)
        : path.resolve(
            (await resolveImport(config.aliases.utils, tsConfig)) ?? cwd,
            '..',
          ),
      services: config.aliases.services
        ? await resolveImport(config.aliases.services, tsConfig)
        : path.resolve(
            (await resolveImport(config.aliases.components, tsConfig))
            ?? cwd,
            '..',
            'services',
          ),
    },
  })
}
