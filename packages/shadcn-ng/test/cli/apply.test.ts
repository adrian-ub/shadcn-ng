import type { RegistryIndex } from '../../src/registry/schemas'

import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { z } from 'zod'
import { apply } from '../../src/cli/commands/apply'
import { ApplyOptionsSchema } from '../../src/cli/schemas/apply'
import { preFlightApply } from '../../src/cli/stages/preflight-apply'
import { runApply } from '../../src/cli/stages/run-apply'
import { DepNotFoundError } from '../../src/registry/errors'
import { REGISTRY_URL_ENV_VAR } from '../../src/registry/source'

// ── P3.T1: apply command — resolve + validate + write components ────────────

const mockFetch = vi.fn()

vi.mock('node-fetch', () => ({
  default: (...args: unknown[]) => mockFetch(...args),
}))

// The apply command prompts for component selection when none are provided.
vi.mock('prompts', () => ({
  default: async () => ({ value: ['button'] }),
}))

// Fixture registry: one `registry:ui` component named `button`.
const index: RegistryIndex = [
  {
    name: 'button',
    type: 'registry:ui',
    title: 'Button',
    files: [
      {
        path: 'button.ts',
        type: 'registry:ui',
        content: 'export const buttonFixture = true\n',
      },
    ],
  },
]

// Valid base color payload for the legacy colors endpoint used by updateFiles.
// The templates intentionally contain literal `${...}` placeholders (registry format).
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
    [`${baseUrl}/styles/new-york/button.json`]: index[0],
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
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'shadcn-apply-'))
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
  vi.clearAllMocks()
  await Promise.all(
    projectDirs.splice(0).map(dir =>
      fs.rm(dir, { recursive: true, force: true }),
    ),
  )
})

// ── ApplyOptionsSchema ───────────────────────────────────────────────────────

describe('applyOptionsSchema', () => {
  it('parses a full apply invocation with components and flags', () => {
    const parsed = ApplyOptionsSchema.parse({
      components: ['button', 'dialog'],
      yes: true,
      overwrite: false,
      cwd: '/tmp/project',
    })

    expect(parsed).toEqual({
      components: ['button', 'dialog'],
      yes: true,
      overwrite: false,
      cwd: '/tmp/project',
    })
  })

  it('accepts a minimal invocation with no components (interactive mode)', () => {
    const parsed = ApplyOptionsSchema.parse({
      yes: false,
      overwrite: false,
      cwd: '/tmp/project',
    })

    expect(parsed.components).toBeUndefined()
    expect(parsed.cwd).toBe('/tmp/project')
  })

  it('rejects a non-array components value with a ZodError', () => {
    expect(() =>
      ApplyOptionsSchema.parse({
        components: 'button',
        yes: false,
        overwrite: false,
        cwd: '/tmp/project',
      }),
    ).toThrow(z.ZodError)
  })

  it('rejects a missing cwd', () => {
    expect(() =>
      ApplyOptionsSchema.parse({
        components: ['button'],
        yes: false,
        overwrite: false,
      }),
    ).toThrow(z.ZodError)
  })
})

// ── preFlightApply ───────────────────────────────────────────────────────────

describe('preFlightApply', () => {
  it('flags a missing target directory as MISSING_DIR_OR_EMPTY_PROJECT', async () => {
    const cwd = path.join(os.tmpdir(), 'shadcn-apply-does-not-exist')

    const result = await preFlightApply(cwd)

    expect(result.errors.MISSING_DIR_OR_EMPTY_PROJECT).toBe(true)
    expect(result.config).toBeNull()
  })

  it('flags an empty project (no package.json) as MISSING_DIR_OR_EMPTY_PROJECT', async () => {
    const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'shadcn-apply-'))
    projectDirs.push(cwd)

    const result = await preFlightApply(cwd)

    expect(result.errors.MISSING_DIR_OR_EMPTY_PROJECT).toBe(true)
    expect(result.config).toBeNull()
  })

  it('flags a missing components.json as MISSING_CONFIG', async () => {
    const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'shadcn-apply-'))
    projectDirs.push(cwd)
    await fs.writeFile(
      path.join(cwd, 'package.json'),
      JSON.stringify({ name: 'fixture', version: '0.0.0' }),
    )

    const result = await preFlightApply(cwd)

    expect(result.errors.MISSING_CONFIG).toBe(true)
    expect(result.config).toBeNull()
  })

  it('resolves the config for a valid project', async () => {
    const cwd = await createProjectFixtures()
    projectDirs.push(cwd)

    const result = await preFlightApply(cwd)

    expect(result.errors).toEqual({})
    expect(result.config).not.toBeNull()
    expect(result.config!.resolvedPaths.cwd).toBe(cwd)
    expect(result.config!.resolvedPaths.ui).toBe(
      path.join(cwd, 'src', 'components', 'ui'),
    )
  })
})

// ── runApply ─────────────────────────────────────────────────────────────────

describe('runApply', () => {
  it('resolves a component and writes its files into the project', async () => {
    vi.stubEnv(REGISTRY_URL_ENV_VAR, 'https://r.example.com/r')
    mockRegistry('https://r.example.com/r')
    const cwd = await createProjectFixtures()
    projectDirs.push(cwd)

    const result = await runApply({
      components: ['button'],
      yes: true,
      overwrite: false,
      cwd,
    })

    const written = path.join(cwd, 'src', 'components', 'ui', 'button.ts')
    const content = await fs.readFile(written, 'utf-8')
    expect(content).toBe('export const buttonFixture = true\n')
    expect(result.components).toEqual(['button'])
    expect(result.filesCreated).toEqual([
      path.join('src', 'components', 'ui', 'button.ts'),
    ])
    expect(result.filesUpdated).toEqual([])
    expect(result.filesSkipped).toEqual([])
  })

  it('prompts for component selection when none are provided', async () => {
    vi.stubEnv(REGISTRY_URL_ENV_VAR, 'https://r.example.com/r')
    mockRegistry('https://r.example.com/r')
    const cwd = await createProjectFixtures()
    projectDirs.push(cwd)

    const result = await runApply({
      components: undefined,
      yes: false,
      overwrite: false,
      cwd,
    })

    expect(result.components).toEqual(['button'])
    const written = path.join(cwd, 'src', 'components', 'ui', 'button.ts')
    expect(await fs.readFile(written, 'utf-8')).toContain('buttonFixture')
  })

  it('overwrites an existing file when --overwrite is passed', async () => {
    vi.stubEnv(REGISTRY_URL_ENV_VAR, 'https://r.example.com/r')
    mockRegistry('https://r.example.com/r')
    const cwd = await createProjectFixtures()
    projectDirs.push(cwd)

    const target = path.join(cwd, 'src', 'components', 'ui', 'button.ts')
    await fs.mkdir(path.dirname(target), { recursive: true })
    await fs.writeFile(target, '// legacy content\n')

    const result = await runApply({
      components: ['button'],
      yes: true,
      overwrite: true,
      cwd,
    })

    expect(await fs.readFile(target, 'utf-8')).toBe(
      'export const buttonFixture = true\n',
    )
    expect(result.filesUpdated).toEqual([
      path.join('src', 'components', 'ui', 'button.ts'),
    ])
    expect(result.filesCreated).toEqual([])
    expect(result.filesSkipped).toEqual([])
  })

  it('rejects with DepNotFoundError for an unknown component', async () => {
    vi.stubEnv(REGISTRY_URL_ENV_VAR, 'https://r.example.com/r')
    mockRegistry('https://r.example.com/r')
    const cwd = await createProjectFixtures()
    projectDirs.push(cwd)

    await expect(
      runApply({
        components: ['ghost'],
        yes: true,
        overwrite: false,
        cwd,
      }),
    ).rejects.toThrow(DepNotFoundError)
  })

  it('exits with code 1 when the target directory does not exist', async () => {
    const exitSpy = vi
      .spyOn(process, 'exit')
      .mockImplementation(() => undefined as never)
    const cwd = path.join(os.tmpdir(), 'shadcn-apply-does-not-exist')

    await expect(
      runApply({
        components: ['button'],
        yes: true,
        overwrite: false,
        cwd,
      }),
    ).rejects.toThrow(/Failed to read config/)

    expect(exitSpy).toHaveBeenCalledWith(1)
    exitSpy.mockRestore()
  })
})

// ── apply command (commander wiring) ─────────────────────────────────────────

describe('apply command', () => {
  it('registers the apply command shape', () => {
    expect(apply.name()).toBe('apply')
    expect(apply.description()).toBe('apply a component to your project')

    const help = apply.helpInformation()
    expect(help).toContain('[components...]')
    expect(help).toContain('-y, --yes')
    expect(help).toContain('-o, --overwrite')
    expect(help).toContain('-c, --cwd <cwd>')
  })
})
