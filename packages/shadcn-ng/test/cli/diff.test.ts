import type { Change } from 'diff'
import type { Config } from '../../src/registry/schema'
import type { RegistryIndex } from '../../src/registry/schemas'

import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'

import { green, red } from 'kleur/colors'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { z } from 'zod'

import { diff } from '../../src/cli/commands/diff'
import { DiffOptionsSchema } from '../../src/cli/schemas/diff'
import { formatDiffLines, runDiff } from '../../src/cli/stages/run-diff'

// ── P3.T5: enhanced diff — unified output + `--path` lookup override ────────
//
// The diff command now renders a unified diff (lines prefixed with `+`/`-`/
// two spaces and colored via kleur) instead of raw diff hunks, and exposes
// the `-p/--path <path>` flag to locate existing files outside the default
// target directories.

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

const configMocks = vi.hoisted(() => ({
  getConfig: vi.fn(),
}))

vi.mock('../../src/cli/stages/get-config', () => configMocks)

// Fixture registry: one `registry:ui` component named `button`.
const buttonItem: RegistryIndex[number] = {
  name: 'button',
  type: 'registry:ui',
  title: 'Button',
  files: [
    {
      path: 'ui/button.ts',
      type: 'registry:ui',
      content: 'export const buttonFixture = true\n',
    },
  ],
}

const index: RegistryIndex = [buttonItem]

// Valid base color payload for the legacy colors endpoint used by the diff
// transformer pipeline.
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
  registryMocks.getRegistryIndex.mockResolvedValue(index)
  registryMocks.fetchTree.mockResolvedValue([buttonItem])
  registryMocks.getRegistryBaseColor.mockResolvedValue(baseColor)
  configMocks.getConfig.mockImplementation(
    async (cwd: string) => buildConfig(cwd),
  )
})

afterEach(async () => {
  vi.clearAllMocks()
  await Promise.all(
    projectDirs.splice(0).map(dir =>
      fs.rm(dir, { recursive: true, force: true }),
    ),
  )
})

// ── DiffOptionsSchema ────────────────────────────────────────────────────────

describe('diffOptionsSchema', () => {
  it('parses a full invocation including component and path', () => {
    const parsed = DiffOptionsSchema.parse({
      component: 'button',
      yes: false,
      cwd: '/tmp/project',
      path: 'src/custom',
    })

    expect(parsed).toEqual({
      component: 'button',
      yes: false,
      cwd: '/tmp/project',
      path: 'src/custom',
    })
  })

  it('rejects a missing cwd', () => {
    expect(() =>
      DiffOptionsSchema.parse({
        component: 'button',
        yes: false,
      }),
    ).toThrow(z.ZodError)
  })
})

// ── formatDiffLines ──────────────────────────────────────────────────────────

describe('formatDiffLines', () => {
  it('renders added and removed lines with + / - markers and colors', () => {
    const patch: Change[] = [
      {
        value: 'export const buttonFixture = true\n',
        added: false,
        removed: true,
      },
      {
        value: 'export const local = true\n',
        added: true,
        removed: false,
      },
    ]

    const output = formatDiffLines(patch)

    expect(output).toBe(
      `${red('- export const buttonFixture = true')}\n`
      + `${green('+ export const local = true')}\n`,
    )
  })

  it('renders context lines with a two-space indent', () => {
    const patch: Change[] = [
      { value: '// header\n', added: false, removed: false },
      {
        value: 'export const buttonFixture = true\n',
        added: false,
        removed: true,
      },
      {
        value: 'export const local = true\n',
        added: true,
        removed: false,
      },
    ]

    const output = formatDiffLines(patch)

    expect(output).toContain(`  // header\n`)
    expect(output).toContain(red('- export const buttonFixture = true'))
    expect(output).toContain(green('+ export const local = true'))
  })
})

// ── runDiff ──────────────────────────────────────────────────────────────────

describe('runDiff', () => {
  it('prints a colored unified diff for a component with changes', async () => {
    const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'shadcn-diff-'))
    projectDirs.push(cwd)
    const uiDir = path.join(cwd, 'src', 'components', 'ui')
    await fs.mkdir(uiDir, { recursive: true })
    await fs.writeFile(
      path.join(uiDir, 'button.ts'),
      'export const local = true\n',
    )

    const stdout: string[] = []
    const writeSpy = vi
      .spyOn(process.stdout, 'write')
      .mockImplementation((chunk: unknown) => {
        stdout.push(String(chunk))
        return true
      })

    await runDiff({ component: 'button', yes: false, cwd })

    const output = stdout.join('')
    expect(output).toContain(red('- export const buttonFixture = true'))
    expect(output).toContain(green('+ export const local = true'))
    writeSpy.mockRestore()
  })

  it('locates existing files under the --path override', async () => {
    const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'shadcn-diff-'))
    projectDirs.push(cwd)
    const customDir = path.join(cwd, 'src', 'custom')
    await fs.mkdir(customDir, { recursive: true })
    await fs.writeFile(
      path.join(customDir, 'button.ts'),
      'export const local = true\n',
    )

    const stdout: string[] = []
    const writeSpy = vi
      .spyOn(process.stdout, 'write')
      .mockImplementation((chunk: unknown) => {
        stdout.push(String(chunk))
        return true
      })

    await runDiff({ component: 'button', path: 'src/custom', yes: false, cwd })

    expect(stdout.join('')).toContain(green('+ export const local = true'))
    writeSpy.mockRestore()
  })
})

// ── diff command (commander wiring) ──────────────────────────────────────────

describe('diff command', () => {
  it('registers the diff command shape with the path flag', () => {
    expect(diff.name()).toBe('diff')

    const help = diff.helpInformation()
    expect(help).toContain('[component]')
    expect(help).toContain('-p, --path <path>')
  })
})
