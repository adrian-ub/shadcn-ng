import type { Config } from '../../src/registry/schema'

import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { z } from 'zod'

import { init } from '../../src/cli/commands/init'
import { InitSchema } from '../../src/cli/schemas/init'
import {
  AVAILABLE_TEMPLATES,
  DEFAULT_TEMPLATE,
  resolveTemplate,
} from '../../src/cli/stages/resolve-template'
import { runInit } from '../../src/cli/stages/run-init'
import { logger } from '../../src/utils/logger'

// ── P3.T5: enhanced init — template selection + fixed --defaults flag ───────
//
// init gains `--template <name>` selection: an explicit valid template is
// honored, an unknown template errors listing the available ones, `--defaults`
// silently uses the locked default, and an interactive prompt is shown when
// the flag is omitted. The broken `-d, --defaults,` option (trailing comma)
// is fixed to `--defaults`.

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

const stageMocks = vi.hoisted(() => ({
  preFlightInit: vi.fn(),
  getProjectConfig: vi.fn(),
  getProjectTailwindVersionFromConfig: vi.fn(),
}))

vi.mock('../../src/cli/stages/preflight-init', () => ({
  preFlightInit: stageMocks.preFlightInit,
}))
vi.mock('../../src/cli/stages/get-project-info', () => stageMocks)

const promptMock = vi.hoisted(() => vi.fn())

vi.mock('prompts', () => ({
  default: promptMock,
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
  promptMock.mockResolvedValue({ value: 'ssr' })
  registryMocks.registryResolveItemsTree.mockResolvedValue(tree)
  registryMocks.getRegistryBaseColor.mockResolvedValue(baseColor)
  stageMocks.getProjectTailwindVersionFromConfig.mockResolvedValue('v4')
})

afterEach(async () => {
  vi.clearAllMocks()
  await Promise.all(
    projectDirs.splice(0).map(dir =>
      fs.rm(dir, { recursive: true, force: true }),
    ),
  )
})

// ── InitSchema ───────────────────────────────────────────────────────────────

describe('initSchema', () => {
  it('parses a full invocation including the template', () => {
    const parsed = InitSchema.parse({
      cwd: '/tmp/project',
      components: ['button'],
      force: false,
      defaults: false,
      yes: true,
      cssVariables: true,
      template: 'standalone',
    })

    expect(parsed).toEqual({
      cwd: '/tmp/project',
      components: ['button'],
      force: false,
      defaults: false,
      yes: true,
      cssVariables: true,
      template: 'standalone',
    })
  })

  it('treats template as optional', () => {
    const parsed = InitSchema.parse({
      cwd: '/tmp/project',
      components: [],
      force: false,
      defaults: true,
      yes: true,
      cssVariables: true,
    })

    expect(parsed.template).toBeUndefined()
  })

  it('rejects a missing cwd', () => {
    expect(() =>
      InitSchema.parse({
        components: [],
        force: false,
        defaults: false,
        yes: true,
        cssVariables: true,
      }),
    ).toThrow(z.ZodError)
  })
})

// ── resolveTemplate ──────────────────────────────────────────────────────────

describe('resolveTemplate', () => {
  it('returns an explicitly provided valid template without prompting', async () => {
    await expect(resolveTemplate('ssr', { defaults: false })).resolves.toBe(
      'ssr',
    )
    expect(promptMock).not.toHaveBeenCalled()
  })

  it('rejects an unknown template listing the available templates', async () => {
    await expect(
      resolveTemplate('bogus', { defaults: false }),
    ).rejects.toThrow(/Available templates: .*standalone/)
  })

  it('uses the locked default template when defaults are requested', async () => {
    await expect(
      resolveTemplate(undefined, { defaults: true }),
    ).resolves.toBe(DEFAULT_TEMPLATE)
    expect(promptMock).not.toHaveBeenCalled()
  })

  it('prompts for a template when omitted interactively', async () => {
    await expect(
      resolveTemplate(undefined, { defaults: false }),
    ).resolves.toBe('ssr')

    expect(promptMock).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'select', name: 'value' }),
      expect.anything(),
    )
  })

  it('exposes the standalone template set and locked default', () => {
    expect(AVAILABLE_TEMPLATES).toContain(DEFAULT_TEMPLATE)
    expect(AVAILABLE_TEMPLATES).toEqual([
      'standalone',
      'ssr',
      'nx-monorepo',
    ])
  })
})

// ── init command (commander wiring) ──────────────────────────────────────────

describe('init command', () => {
  it('registers --template and the fixed --defaults option', () => {
    const longs = init.options.map(option => option.long)

    expect(longs).toContain('--template')
    expect(longs).toContain('--defaults')
    expect(longs).not.toContain('--defaults,')
  })
})

// ── runInit ──────────────────────────────────────────────────────────────────

describe('runInit', () => {
  it('resolves the template and reports it during init', async () => {
    const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'shadcn-init-'))
    projectDirs.push(cwd)
    await fs.writeFile(
      path.join(cwd, 'package.json'),
      JSON.stringify({ name: 'fixture', version: '0.0.0' }),
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

    stageMocks.preFlightInit.mockResolvedValue({ errors: {}, projectInfo: null })
    stageMocks.getProjectConfig.mockImplementation(
      async (cwd: string) => buildConfig(cwd),
    )

    const logInfoSpy = vi.spyOn(logger, 'info').mockImplementation(() => {})

    const result = await runInit({
      cwd,
      components: [],
      force: false,
      defaults: true,
      yes: true,
      cssVariables: true,
    })

    expect(result.resolvedPaths.cwd).toBe(cwd)
    expect(logInfoSpy).toHaveBeenCalledWith(
      expect.stringContaining('Using the'),
    )
    expect(logInfoSpy).toHaveBeenCalledWith(
      expect.stringContaining(DEFAULT_TEMPLATE),
    )
    expect(promptMock).not.toHaveBeenCalled()

    const written = JSON.parse(
      await fs.readFile(path.join(cwd, 'components.json'), 'utf-8'),
    )
    expect(written.style).toBe('new-york')

    expect(registryMocks.registryResolveItemsTree).toHaveBeenCalledWith(
      expect.arrayContaining(['index']),
      expect.anything(),
    )

    logInfoSpy.mockRestore()
  })
})
