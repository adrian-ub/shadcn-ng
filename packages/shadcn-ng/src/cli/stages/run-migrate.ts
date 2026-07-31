import type { z } from 'zod'

import type { RawConfig } from '../../registry/schemas/config'

import type { MigrateOptions, MigrateResult } from '../schemas/migrate'

import { existsSync, promises as fs } from 'node:fs'

import path from 'node:path'

import { rawConfigSchema } from '../../registry/schemas/config'
import { highlighter } from '../../utils/highlighter'
import { logger } from '../../utils/logger'

export const LOCAL_CONFIG_SCHEMA_URL = 'https://ui.adrianub.dev/schema.json'

const LEGACY_SCHEMA_URLS = new Set(['https://ui.shadcn.com/schema.json'])

const LEGACY_CONFIG_KEYS = ['rsc', 'tsx', 'typescript'] as const

const LEGACY_ALIAS_KEYS = ['hooks'] as const

export interface MigratedConfig {
  config: RawConfig
  changes: string[]
}

/**
 * Migrates a legacy v1 shadcn config into the canonical format described by
 * {@link rawConfigSchema}: legacy flags (`rsc`, `tsx`, `typescript`) and the
 * `aliases.hooks` alias are dropped, tailwind defaults are filled in, and the
 * `$schema` URL is normalized to the local registry schema.
 */
export function transformConfig(input: unknown): MigratedConfig {
  if (!isRecord(input)) {
    throw new Error('components.json must contain a JSON object.')
  }

  const changes: string[] = []
  const next: Record<string, unknown> = { ...input }

  for (const key of LEGACY_CONFIG_KEYS) {
    if (key in next) {
      delete next[key]
      changes.push(`Removed legacy "${key}" field.`)
    }
  }

  if (isRecord(next.aliases)) {
    const aliases = { ...next.aliases }

    for (const key of LEGACY_ALIAS_KEYS) {
      if (key in aliases) {
        delete aliases[key]
        changes.push(`Removed legacy "aliases.${key}" alias.`)
      }
    }

    next.aliases = aliases
  }

  if (isRecord(next.tailwind)) {
    const tailwind = { ...next.tailwind }

    if (!('cssVariables' in tailwind)) {
      tailwind.cssVariables = true
      changes.push('Defaulted "tailwind.cssVariables" to true.')
    }

    if (!('prefix' in tailwind)) {
      tailwind.prefix = ''
      changes.push('Defaulted "tailwind.prefix" to "".')
    }

    next.tailwind = tailwind
  }

  if (typeof next.$schema !== 'string' || LEGACY_SCHEMA_URLS.has(next.$schema)) {
    next.$schema = LOCAL_CONFIG_SCHEMA_URL
    changes.push('Updated "$schema" to the new schema URL.')
  }

  const parsed = rawConfigSchema.safeParse(next)

  if (!parsed.success) {
    throw new Error(
      `components.json is not a valid shadcn-ng config:\n${formatZodIssues(parsed.error)}`,
    )
  }

  return {
    config: parsed.data,
    changes,
  }
}

export async function runMigrate(
  options: MigrateOptions,
): Promise<MigrateResult> {
  const configPath = options.path
    ? path.resolve(options.cwd, options.path)
    : path.resolve(options.cwd, 'components.json')

  if (!existsSync(configPath)) {
    throw new Error(`No config file found at ${highlighter.info(configPath)}.`)
  }

  const raw = await fs.readFile(configPath, 'utf-8')

  let input: unknown
  try {
    input = JSON.parse(raw)
  }
  catch (error) {
    throw new Error(
      `Failed to parse ${highlighter.info(configPath)}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    )
  }

  const { config, changes } = transformConfig(input)

  if (options.dryRun) {
    logger.info('Dry run — no changes written. The migrated config would be:')
    logger.log(JSON.stringify(config, null, 2))

    return {
      path: configPath,
      dryRun: true,
      written: false,
      changes,
      config,
    }
  }

  if (changes.length === 0) {
    logger.info(`No migration needed for ${highlighter.info(configPath)}.`)

    return {
      path: configPath,
      dryRun: false,
      written: false,
      changes,
      config,
    }
  }

  await fs.writeFile(
    configPath,
    `${JSON.stringify(config, null, 2)}\n`,
    'utf-8',
  )

  logger.break()
  logger.success(`Migrated ${highlighter.info(configPath)}:`)
  for (const change of changes) {
    logger.log(`  - ${change}`)
  }
  logger.break()

  return {
    path: configPath,
    dryRun: false,
    written: true,
    changes,
    config,
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function formatZodIssues(error: z.ZodError): string {
  return error.errors
    .map((issue) => {
      const issuePath = issue.path.length ? issue.path.join('.') : '(root)'
      return `  - ${issuePath}: ${issue.message}`
    })
    .join('\n')
}
