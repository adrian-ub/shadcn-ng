import type { RegistryIndex } from '../../src/registry/schemas'

import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { z } from 'zod'

import { preset } from '../../src/cli/commands/preset'
import { PresetApplyOptionsSchema } from '../../src/cli/schemas/preset'
import {
  PRESETS,
  resolvePreset,
  runPresetApply,
  runPresetList,
} from '../../src/cli/stages/run-preset'
import { REGISTRY_URL_ENV_VAR } from '../../src/registry/source'

// ── P3.T3: preset command — list + apply component presets ─────────────────────

const mockFetch = vi.fn()

vi.mock('node-fetch', () => ({
  default: (...args: unknown[]) => mockFetch(...args),
}))

// Fixture registry: the five components referenced by the "starter" preset.
const componentNames = ['button', 'card', 'input', 'label', 'badge']

const index: RegistryIndex = componentNames.map(name => ({
  name,
  type: 'registry:ui' as const,
  title: name[0].toUpperCase() + name.slice(1),
  files: [
    {
      path: `${name}.ts`,
      type: 'registry:ui' as const,
      content: `export const ${name}Fixture = true\n`,
    },
  ],
}))

// Valid base color payload for the legacy colors endpoint used by updateFiles.
const baseColor = {
  inlineColors: { light: {}, dark: {} },
  cssVars: { light: {}, dark: {} },
  // eslint-disable-next-line no-template-curly-in-string
  inlineColorsTemplate: 'inline: ${colors}',
  // eslint-disable-next-line no-template-curly-in-string
  cssVarsTemplate: ':root ${colors}',
}

function buildPayloads(baseUrl: string): Record<string, unknown> {
  return {
    [`${baseUrl}/index.json`]: index,
    ...Object.fromEntries(
      componentNames.map(name => [
        `${baseUrl}/styles/new-york/${name}.json`,
        index.find(entry => entry.name === name),
      ]),
    ),
    'https://ui.adrianub.dev/r/colors/slate.json': baseColor,
  }
}

function mockRegistry(baseUrl: string): void {
  const payloads = buildPayloads(baseUrl)
  mockFetch.mockImplementation(async (url: string) => ({
    ok: true,
    status: 200,
    statusText: 'OK',
    json: async () => payloads[url],
  }))
}

async function createProjectFixtures(): Promise<string> {
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'shadcn-preset-'))
  await fs.writeFile(
    path.join(cwd, 'package.json'),
    JSON.stringify({ name: 'fixture', version: '0.0.0' }),
  )
  await fs.writeFile(
    path.join(cwd, 'components.json'),
    JSON.stringify({
      $schema: 'https://ui.adrianub.dev/schema.json',
      style: 'new-york',
      tailwind: {
        config: 'tailwind.config.js',
        css: 'src/styles.css',
        baseColor: 'slate',
        cssVariables: true,
      },
      aliases: {
        components: '~/components',
        utils: '~/lib/utils',
      },
    }),
  )
  await fs.writeFile(
    path.join(cwd, 'tsconfig.json'),
    JSON.stringify({
      compilerOptions: {
        baseUrl: '.',
        paths: { '~/*': ['./src/*'] },
      },
    }),
  )
  return cwd
}

const projectDirs: string[] = []

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(async () => {
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
  await Promise.all(
    projectDirs.splice(0).map(dir =>
      fs.rm(dir, { recursive: true, force: true }),
    ),
  )
})

// ── Preset catalog ─────────────────────────────────────────────────────────────

describe('preset catalog', () => {
  it('exposes at least three presets with unique names and components', () => {
    expect(PRESETS.length).toBeGreaterThanOrEqual(3)

    const names = PRESETS.map(presetEntry => presetEntry.name)
    expect(new Set(names).size).toBe(names.length)

    for (const presetEntry of PRESETS) {
      expect(presetEntry.name.length).toBeGreaterThan(0)
      expect(presetEntry.description.length).toBeGreaterThan(0)
      expect(presetEntry.components.length).toBeGreaterThan(0)
    }
  })

  it('every preset references only non-empty component names', () => {
    const allComponents = PRESETS.flatMap(presetEntry => presetEntry.components)

    expect(allComponents.length).toBeGreaterThan(0)
    for (const component of allComponents) {
      expect(component.length).toBeGreaterThan(0)
    }
  })
})

// ── resolvePreset (pure) ───────────────────────────────────────────────────────

describe('resolvePreset', () => {
  it('resolves a known preset with its components', () => {
    const starter = resolvePreset('starter')

    expect(starter.name).toBe('starter')
    expect(starter.components).toContain('button')
    expect(starter.components).toContain('card')
  })

  it('throws for an unknown preset and lists the available ones', () => {
    expect(() => resolvePreset('ghost')).toThrow(
      /Unknown preset "ghost"/,
    )
    expect(() => resolvePreset('ghost')).toThrow(/starter/)
  })
})

// ── PresetApplyOptionsSchema ───────────────────────────────────────────────────

describe('presetApplyOptionsSchema', () => {
  it('parses a full apply invocation', () => {
    const parsed = PresetApplyOptionsSchema.parse({
      name: 'starter',
      cwd: '/tmp/project',
      yes: true,
      overwrite: false,
    })

    expect(parsed).toEqual({
      name: 'starter',
      cwd: '/tmp/project',
      yes: true,
      overwrite: false,
    })
  })

  it('rejects a missing preset name with a ZodError', () => {
    expect(() =>
      PresetApplyOptionsSchema.parse({
        cwd: '/tmp/project',
        yes: false,
        overwrite: false,
      }),
    ).toThrow(z.ZodError)
  })

  it('rejects a missing cwd with a ZodError', () => {
    expect(() =>
      PresetApplyOptionsSchema.parse({
        name: 'starter',
        yes: false,
        overwrite: false,
      }),
    ).toThrow(z.ZodError)
  })
})

// ── runPresetList ──────────────────────────────────────────────────────────────

describe('runPresetList', () => {
  it('returns the full preset catalog', async () => {
    const result = await runPresetList()

    expect(result).toEqual(PRESETS)
  })

  it('prints the catalog header and each preset name', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    await runPresetList()

    const output = logSpy.mock.calls.flat().join('\n')
    expect(output).toContain('Available presets')
    expect(output).toContain('starter')
    expect(output).toContain('forms')
    expect(output).toContain('dashboard')
  })
})

// ── runPresetApply ─────────────────────────────────────────────────────────────

describe('runPresetApply', () => {
  it('resolves the preset components through the registry and writes them', async () => {
    vi.stubEnv(REGISTRY_URL_ENV_VAR, 'https://r.example.com/r')
    mockRegistry('https://r.example.com/r')
    const cwd = await createProjectFixtures()
    projectDirs.push(cwd)

    const result = await runPresetApply({
      name: 'starter',
      cwd,
      yes: true,
      overwrite: false,
    })

    expect(result.name).toBe('starter')
    expect(result.components).toEqual([
      'button',
      'card',
      'input',
      'label',
      'badge',
    ])

    for (const component of componentNames) {
      const filePath = path.join(
        cwd,
        'src',
        'components',
        'ui',
        `${component}.ts`,
      )
      expect(await fs.readFile(filePath, 'utf-8')).toBe(
        `export const ${component}Fixture = true\n`,
      )
    }

    expect(result.filesCreated).toHaveLength(componentNames.length)
    expect(result.filesUpdated).toEqual([])
    expect(result.filesSkipped).toEqual([])
  })

  it('rejects an unknown preset without touching the registry', async () => {
    vi.stubEnv(REGISTRY_URL_ENV_VAR, 'https://r.example.com/r')
    mockRegistry('https://r.example.com/r')
    const cwd = await createProjectFixtures()
    projectDirs.push(cwd)

    await expect(
      runPresetApply({
        name: 'ghost',
        cwd,
        yes: true,
        overwrite: false,
      }),
    ).rejects.toThrow(/Unknown preset "ghost"/)
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('exits with code 1 when the target directory does not exist', async () => {
    const exitSpy = vi
      .spyOn(process, 'exit')
      .mockImplementation(() => undefined as never)
    const cwd = path.join(os.tmpdir(), 'shadcn-preset-does-not-exist')

    await expect(
      runPresetApply({
        name: 'starter',
        cwd,
        yes: true,
        overwrite: false,
      }),
    ).rejects.toThrow(/Failed to read config/)

    expect(exitSpy).toHaveBeenCalledWith(1)
    exitSpy.mockRestore()
  })
})

// ── preset command (commander wiring) ──────────────────────────────────────────

describe('preset command', () => {
  it('registers the preset command with list and apply subcommands', () => {
    expect(preset.name()).toBe('preset')
    expect(preset.description()).toBe('manage component presets.')

    const subcommands = preset.commands.map(command => command.name())
    expect(subcommands).toContain('list')
    expect(subcommands).toContain('apply')

    const help = preset.helpInformation()
    expect(help).toContain('list')
    expect(help).toContain('apply')
  })
})
