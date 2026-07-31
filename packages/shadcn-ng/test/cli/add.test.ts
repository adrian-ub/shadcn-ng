import type { Config } from '../../src/registry/schema'

import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { z } from 'zod'

import { add } from '../../src/cli/commands/add'
import { AddOptionsSchema } from '../../src/cli/schemas/add'
import { addComponents } from '../../src/cli/stages/add-components'
import { resolveFilePath } from '../../src/cli/stages/updaters/update-files'

// ── P3.T5: enhanced add — `--path` flag threads through to file writes ──────
//
// The add command already exposes `-p/--path <path>` but the value is dropped:
// addComponents → updateFiles never received it. These tests pin the target
// directory override down to the actual file writes.

const registryMocks = vi.hoisted(() => ({
  getRegistryStyles: vi.fn(),
  getRegistryBaseColors: vi.fn(),
  registryResolveItemsTree: vi.fn(),
  getRegistryBaseColor: vi.fn(),
  getRegistryIndex: vi.fn(),
  fetchTree: vi.fn(),
  getItemTargetPath: vi.fn(),
}))

vi.mock('../../src/cli/registry', () => registryMocks)

const updaterMocks = vi.hoisted(() => ({
  updateDependencies: vi.fn(),
  updateCssVars: vi.fn(),
  updateTailwindConfig: vi.fn(),
}))

vi.mock('../../src/cli/stages/updaters/update-dependencies', () => ({
  updateDependencies: updaterMocks.updateDependencies,
}))
vi.mock('../../src/cli/stages/updaters/update-css-vars', () => ({
  updateCssVars: updaterMocks.updateCssVars,
}))
vi.mock('../../src/cli/stages/updaters/update-tailwind-config', () => ({
  updateTailwindConfig: updaterMocks.updateTailwindConfig,
}))

const projectInfoMocks = vi.hoisted(() => ({
  getProjectTailwindVersionFromConfig: vi.fn(),
}))

vi.mock('../../src/cli/stages/get-project-info', () => projectInfoMocks)

// The init flow used by `add` for auto-init must not require the template
// engine — resolveTemplate is mocked here because this suite only exercises
// the add → addComponents path.
vi.mock('../../src/cli/stages/resolve-template', () => ({
  AVAILABLE_TEMPLATES: ['standalone', 'ssr', 'nx-monorepo'],
  DEFAULT_TEMPLATE: 'standalone',
  resolveTemplate: vi.fn(async () => 'standalone'),
}))

// Fixture registry tree: one `registry:ui` component named `button`.
const tree = {
  dependencies: [],
  files: [
    {
      path: 'ui/button.ts',
      type: 'registry:ui',
      content: 'export const buttonFixture = true\n',
    },
  ],
  tailwind: { config: [] },
  cssVars: {},
  docs: '',
}

// Valid base color payload for the legacy colors endpoint used by updateFiles.
const baseColor = {
  inlineColors: { light: {}, dark: {} },
  cssVars: { light: {}, dark: {} },
  // eslint-disable-next-line no-template-curly-in-string
  inlineColorsTemplate: 'inline: ${colors}',
  // eslint-disable-next-line no-template-curly-in-string
  cssVarsTemplate: ':root ${colors}',
}

function buildConfig(cwd: string): Config {
  return {
    $schema: 'https://ui.adrianub.dev/schema.json',
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
    resolvedPaths: {
      cwd,
      tailwindConfig: path.join(cwd, 'tailwind.config.js'),
      tailwindCss: path.join(cwd, 'src', 'styles.css'),
      utils: path.join(cwd, 'src', 'lib', 'utils'),
      components: path.join(cwd, 'src', 'components'),
      lib: path.join(cwd, 'src', 'lib'),
      services: path.join(cwd, 'src', 'services'),
      ui: path.join(cwd, 'src', 'components', 'ui'),
    },
  }
}

const projectDirs: string[] = []

beforeEach(() => {
  vi.clearAllMocks()
  projectInfoMocks.getProjectTailwindVersionFromConfig.mockResolvedValue('v4')
  registryMocks.registryResolveItemsTree.mockResolvedValue(tree)
  registryMocks.getRegistryBaseColor.mockResolvedValue(baseColor)
})

afterEach(async () => {
  vi.clearAllMocks()
  await Promise.all(
    projectDirs.splice(0).map(dir =>
      fs.rm(dir, { recursive: true, force: true }),
    ),
  )
})

// ── AddOptionsSchema ─────────────────────────────────────────────────────────

describe('addOptionsSchema', () => {
  it('parses a full invocation including the path flag', () => {
    const parsed = AddOptionsSchema.parse({
      components: ['button'],
      yes: true,
      overwrite: false,
      cwd: '/tmp/project',
      all: false,
      path: 'src/custom',
      cssVariables: true,
    })

    expect(parsed).toEqual({
      components: ['button'],
      yes: true,
      overwrite: false,
      cwd: '/tmp/project',
      all: false,
      path: 'src/custom',
      cssVariables: true,
    })
  })

  it('rejects a non-array components value with a ZodError', () => {
    expect(() =>
      AddOptionsSchema.parse({
        components: 'button',
        yes: false,
        overwrite: false,
        cwd: '/tmp/project',
        all: false,
        cssVariables: true,
      }),
    ).toThrow(z.ZodError)
  })
})

// ── addComponents --path ─────────────────────────────────────────────────────

describe('addComponents --path', () => {
  it('writes component files under the --path target directory', async () => {
    const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'shadcn-add-'))
    projectDirs.push(cwd)

    await addComponents(['button'], buildConfig(cwd), {
      overwrite: true,
      path: 'src/custom',
    })

    const written = path.join(cwd, 'src', 'custom', 'button.ts')
    expect(await fs.readFile(written, 'utf-8')).toBe(
      'export const buttonFixture = true\n',
    )
  })

  it('writes component files to the configured ui directory without --path', async () => {
    const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'shadcn-add-'))
    projectDirs.push(cwd)

    await addComponents(['button'], buildConfig(cwd), {
      overwrite: true,
    })

    const written = path.join(cwd, 'src', 'components', 'ui', 'button.ts')
    expect(await fs.readFile(written, 'utf-8')).toBe(
      'export const buttonFixture = true\n',
    )
  })
})

// ── resolveFilePath --path ───────────────────────────────────────────────────

describe('resolveFilePath --path', () => {
  it('resolves a ui file under the override target directory', () => {
    const cwd = path.join(os.tmpdir(), 'shadcn-add-override')

    const filePath = resolveFilePath(
      { path: 'ui/button.ts', type: 'registry:ui' },
      buildConfig(cwd),
      { path: 'src/custom' },
    )

    expect(filePath).toBe(path.join(cwd, 'src', 'custom', 'button.ts'))
  })

  it('keeps the configured target directory when no override is passed', () => {
    const cwd = path.join(os.tmpdir(), 'shadcn-add-default')

    const filePath = resolveFilePath(
      { path: 'ui/button.ts', type: 'registry:ui' },
      buildConfig(cwd),
    )

    expect(filePath).toBe(
      path.join(cwd, 'src', 'components', 'ui', 'button.ts'),
    )
  })
})

// ── add command (commander wiring) ───────────────────────────────────────────

describe('add command', () => {
  it('registers the add command shape with the path flag', () => {
    expect(add.name()).toBe('add')

    const help = add.helpInformation()
    expect(help).toContain('[components...]')
    expect(help).toContain('-p, --path <path>')
  })
})
