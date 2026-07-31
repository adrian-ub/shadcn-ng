import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import { z } from 'zod'

import { migrate } from '../../src/cli/commands/migrate'
import { MigrateOptionsSchema } from '../../src/cli/schemas/migrate'
import {
  LOCAL_CONFIG_SCHEMA_URL,
  runMigrate,
  transformConfig,
} from '../../src/cli/stages/run-migrate'

// ── P3.T3: migrate command — v1 config → new format (config transform) ────────

const projectDirs: string[] = []

afterEach(async () => {
  await Promise.all(
    projectDirs.splice(0).map(dir =>
      fs.rm(dir, { recursive: true, force: true }),
    ),
  )
})

// ── Fixtures ───────────────────────────────────────────────────────────────────

// Legacy v1 config (upstream shape): schema URL, rsc/tsx/typescript flags,
// a hooks alias, and a tailwind prefix.
const legacyV1Config = {
  $schema: 'https://ui.shadcn.com/schema.json',
  style: 'new-york',
  rsc: true,
  tsx: true,
  typescript: true,
  tailwind: {
    config: 'tailwind.config.ts',
    css: 'src/app/globals.css',
    baseColor: 'zinc',
    cssVariables: true,
    prefix: 'tw-',
  },
  aliases: {
    components: '~/components',
    utils: '~/lib/utils',
    ui: '~/components/ui',
    lib: '~/lib',
    hooks: '~/hooks',
  },
  iconLibrary: 'lucide',
}

// Already-canonical config: passes the new schema untouched.
const canonicalConfig = {
  $schema: LOCAL_CONFIG_SCHEMA_URL,
  style: 'new-york',
  tailwind: {
    config: 'tailwind.config.js',
    css: 'src/styles.css',
    baseColor: 'slate',
    cssVariables: true,
    prefix: '',
  },
  aliases: {
    components: '~/components',
    utils: '~/lib/utils',
  },
  iconLibrary: 'radix',
}

async function createProjectWithConfig(config: unknown): Promise<string> {
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'shadcn-migrate-'))
  await fs.writeFile(
    path.join(cwd, 'package.json'),
    JSON.stringify({ name: 'fixture', version: '0.0.0' }),
  )
  await fs.writeFile(
    path.join(cwd, 'components.json'),
    `${JSON.stringify(config, null, 2)}\n`,
  )
  return cwd
}

// ── MigrateOptionsSchema ───────────────────────────────────────────────────────

describe('migrateOptionsSchema', () => {
  it('parses a full invocation with a custom path and dry-run', () => {
    const parsed = MigrateOptionsSchema.parse({
      path: 'config/components.json',
      cwd: '/tmp/project',
      dryRun: true,
    })

    expect(parsed).toEqual({
      path: 'config/components.json',
      cwd: '/tmp/project',
      dryRun: true,
    })
  })

  it('accepts a minimal invocation with no path (defaults to components.json)', () => {
    const parsed = MigrateOptionsSchema.parse({
      cwd: '/tmp/project',
      dryRun: false,
    })

    expect(parsed.path).toBeUndefined()
    expect(parsed.cwd).toBe('/tmp/project')
  })

  it('rejects a missing cwd with a ZodError', () => {
    expect(() =>
      MigrateOptionsSchema.parse({ dryRun: false }),
    ).toThrow(z.ZodError)
  })

  it('rejects a missing dryRun flag with a ZodError', () => {
    expect(() =>
      MigrateOptionsSchema.parse({ cwd: '/tmp/project' }),
    ).toThrow(z.ZodError)
  })
})

// ── transformConfig (pure) ─────────────────────────────────────────────────────

describe('transformConfig', () => {
  it('migrates a legacy v1 config to the canonical new format', () => {
    const { config, changes } = transformConfig(legacyV1Config)

    expect(config).toEqual({
      $schema: LOCAL_CONFIG_SCHEMA_URL,
      style: 'new-york',
      tailwind: {
        config: 'tailwind.config.ts',
        css: 'src/app/globals.css',
        baseColor: 'zinc',
        cssVariables: true,
        prefix: 'tw-',
      },
      aliases: {
        components: '~/components',
        utils: '~/lib/utils',
        ui: '~/components/ui',
        lib: '~/lib',
      },
      iconLibrary: 'lucide',
    })
    expect(config).not.toHaveProperty('rsc')
    expect(config).not.toHaveProperty('tsx')
    expect(config).not.toHaveProperty('typescript')
    expect(changes).toEqual([
      'Removed legacy "rsc" field.',
      'Removed legacy "tsx" field.',
      'Removed legacy "typescript" field.',
      'Removed legacy "aliases.hooks" alias.',
      'Updated "$schema" to the new schema URL.',
    ])
  })

  it('adds missing tailwind defaults and the local schema URL when absent', () => {
    const { config, changes } = transformConfig({
      style: 'default',
      tailwind: {
        config: './tailwind.config.ts',
        css: './src/assets/css/tailwind.css',
        baseColor: 'neutral',
        cssVariables: false,
      },
      aliases: {
        utils: '@/lib/utils',
        components: '@/components',
      },
    })

    expect(config.tailwind).toEqual({
      config: './tailwind.config.ts',
      css: './src/assets/css/tailwind.css',
      baseColor: 'neutral',
      cssVariables: false,
      prefix: '',
    })
    expect(config.$schema).toBe(LOCAL_CONFIG_SCHEMA_URL)
    expect(changes).toEqual([
      'Defaulted "tailwind.prefix" to "".',
      'Updated "$schema" to the new schema URL.',
    ])
  })

  it('leaves an already-canonical config unchanged with no changes', () => {
    const { config, changes } = transformConfig(canonicalConfig)

    expect(config).toEqual(canonicalConfig)
    expect(changes).toEqual([])
  })

  it('throws for a non-object config file', () => {
    expect(() => transformConfig(null)).toThrow(
      /components.json must contain a JSON object/,
    )
    expect(() => transformConfig('not-an-object')).toThrow(
      /components.json must contain a JSON object/,
    )
    expect(() => transformConfig(['array'])).toThrow(
      /components.json must contain a JSON object/,
    )
  })

  it('throws with a field-level message for a config missing required fields', () => {
    expect(() =>
      transformConfig({
        tailwind: {
          css: 'src/styles.css',
          baseColor: 'slate',
        },
        aliases: {
          components: '~/components',
          utils: '~/lib/utils',
        },
      }),
    ).toThrow(/style/)
  })
})

// ── runMigrate ─────────────────────────────────────────────────────────────────

describe('runMigrate', () => {
  it('migrates and writes the config back to components.json', async () => {
    const cwd = await createProjectWithConfig(legacyV1Config)
    projectDirs.push(cwd)

    const result = await runMigrate({ cwd, dryRun: false })

    const onDisk = JSON.parse(await fs.readFile(path.join(cwd, 'components.json'), 'utf-8'))
    expect(onDisk.$schema).toBe(LOCAL_CONFIG_SCHEMA_URL)
    expect(onDisk).not.toHaveProperty('rsc')
    expect(result.written).toBe(true)
    expect(result.dryRun).toBe(false)
    expect(result.path).toBe(path.join(cwd, 'components.json'))
    expect(result.changes.length).toBeGreaterThan(0)
  })

  it('supports a custom config path relative to the cwd', async () => {
    const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'shadcn-migrate-'))
    projectDirs.push(cwd)
    await fs.mkdir(path.join(cwd, 'config'))
    await fs.writeFile(
      path.join(cwd, 'config', 'legacy.json'),
      `${JSON.stringify(legacyV1Config, null, 2)}\n`,
    )

    const result = await runMigrate({
      path: 'config/legacy.json',
      cwd,
      dryRun: false,
    })

    const onDisk = JSON.parse(
      await fs.readFile(path.join(cwd, 'config', 'legacy.json'), 'utf-8'),
    )
    expect(onDisk).not.toHaveProperty('rsc')
    expect(result.written).toBe(true)
    expect(result.path).toBe(path.join(cwd, 'config', 'legacy.json'))
  })

  it('prints the migrated config without writing when --dry-run', async () => {
    const cwd = await createProjectWithConfig(legacyV1Config)
    projectDirs.push(cwd)
    const original = await fs.readFile(path.join(cwd, 'components.json'), 'utf-8')

    const result = await runMigrate({ cwd, dryRun: true })

    const onDisk = await fs.readFile(path.join(cwd, 'components.json'), 'utf-8')
    expect(onDisk).toBe(original)
    expect(result.written).toBe(false)
    expect(result.dryRun).toBe(true)
  })

  it('does not rewrite an already-canonical config file', async () => {
    const cwd = await createProjectWithConfig(canonicalConfig)
    projectDirs.push(cwd)
    const original = await fs.readFile(path.join(cwd, 'components.json'), 'utf-8')

    const result = await runMigrate({ cwd, dryRun: false })

    expect(await fs.readFile(path.join(cwd, 'components.json'), 'utf-8')).toBe(
      original,
    )
    expect(result.written).toBe(false)
    expect(result.changes).toEqual([])
  })

  it('throws when no config file exists', async () => {
    const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'shadcn-migrate-'))
    projectDirs.push(cwd)

    await expect(runMigrate({ cwd, dryRun: false })).rejects.toThrow(
      /No config file found/,
    )
  })

  it('throws a parse error for an invalid JSON config file', async () => {
    const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'shadcn-migrate-'))
    projectDirs.push(cwd)
    await fs.writeFile(path.join(cwd, 'components.json'), 'not json {', 'utf-8')

    await expect(runMigrate({ cwd, dryRun: false })).rejects.toThrow(
      /Failed to parse/,
    )
  })
})

// ── migrate command (commander wiring) ─────────────────────────────────────────

describe('migrate command', () => {
  it('registers the migrate command shape', () => {
    expect(migrate.name()).toBe('migrate')
    expect(migrate.description()).toBe(
      'migrate an existing shadcn-ng config to the new format.',
    )

    const help = migrate.helpInformation()
    expect(help).toContain('[path]')
    expect(help).toContain('--dry-run')
    expect(help).toContain('-c, --cwd <cwd>')
  })
})
