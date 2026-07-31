import type { RegistryIndex } from '../../src/registry/schemas'

import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { z } from 'zod'

import { eject } from '../../src/cli/commands/eject'
import { EjectOptionsSchema } from '../../src/cli/schemas/eject'
import { runEject } from '../../src/cli/stages/run-eject'
import { DepNotFoundError } from '../../src/registry/errors'
import { REGISTRY_URL_ENV_VAR } from '../../src/registry/source'

// ── P3.T2: eject command — copy resolved files as editable source ────────────

const mockFetch = vi.fn()

vi.mock('node-fetch', () => ({
  default: (...args: unknown[]) => mockFetch(...args),
}))

// The eject command prompts for component selection (multiselect) and for
// overwrite confirmation (confirm). Tests control both via this mock.
const promptsMock = vi.fn()

vi.mock('prompts', () => ({
  default: (...args: unknown[]) => promptsMock(...args),
}))

// Fixture registry: one `registry:ui` component with a ui file and a lib file.
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
      {
        path: 'lib/button-helpers.ts',
        type: 'registry:lib',
        content: 'export const buttonHelpers = true\n',
      },
    ],
  },
]

function buildPayloads(baseUrl: string): Record<string, unknown> {
  return {
    [`${baseUrl}/index.json`]: index,
    [`${baseUrl}/styles/new-york/button.json`]: index[0],
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
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'shadcn-eject-'))
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
  promptsMock.mockResolvedValue({ value: ['button'] })
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

// ── EjectOptionsSchema ────────────────────────────────────────────────────────

describe('ejectOptionsSchema', () => {
  it('parses a full eject invocation with components and flags', () => {
    const parsed = EjectOptionsSchema.parse({
      components: ['button'],
      yes: true,
      overwrite: false,
      cwd: '/tmp/project',
    })

    expect(parsed).toEqual({
      components: ['button'],
      yes: true,
      overwrite: false,
      cwd: '/tmp/project',
    })
  })

  it('accepts a minimal invocation with no components (interactive mode)', () => {
    const parsed = EjectOptionsSchema.parse({
      yes: false,
      overwrite: false,
      cwd: '/tmp/project',
    })

    expect(parsed.components).toBeUndefined()
    expect(parsed.cwd).toBe('/tmp/project')
  })

  it('rejects a non-array components value with a ZodError', () => {
    expect(() =>
      EjectOptionsSchema.parse({
        components: 'button',
        yes: false,
        overwrite: false,
        cwd: '/tmp/project',
      }),
    ).toThrow(z.ZodError)
  })

  it('rejects a missing cwd', () => {
    expect(() =>
      EjectOptionsSchema.parse({
        components: ['button'],
        yes: false,
        overwrite: false,
      }),
    ).toThrow(z.ZodError)
  })
})

// ── runEject ──────────────────────────────────────────────────────────────────

describe('runEject', () => {
  it('copies resolved files into the project as raw editable source', async () => {
    vi.stubEnv(REGISTRY_URL_ENV_VAR, 'https://r.example.com/r')
    mockRegistry('https://r.example.com/r')
    const cwd = await createProjectFixtures()
    projectDirs.push(cwd)

    const result = await runEject({
      components: ['button'],
      yes: true,
      overwrite: false,
      cwd,
    })

    const uiFile = path.join(cwd, 'src', 'components', 'ui', 'button.ts')
    const libFile = path.join(cwd, 'src', 'lib', 'button-helpers.ts')
    expect(await fs.readFile(uiFile, 'utf-8')).toBe(
      'export const buttonFixture = true\n',
    )
    expect(await fs.readFile(libFile, 'utf-8')).toBe(
      'export const buttonHelpers = true\n',
    )
    expect(result.components).toEqual(['button'])
    expect(result.filesEjected).toEqual([
      path.join('src', 'components', 'ui', 'button.ts'),
      path.join('src', 'lib', 'button-helpers.ts'),
    ])
    expect(result.filesSkipped).toEqual([])
  })

  it('prompts for component selection when none are provided', async () => {
    vi.stubEnv(REGISTRY_URL_ENV_VAR, 'https://r.example.com/r')
    mockRegistry('https://r.example.com/r')
    const cwd = await createProjectFixtures()
    projectDirs.push(cwd)

    const result = await runEject({
      components: undefined,
      yes: false,
      overwrite: false,
      cwd,
    })

    expect(promptsMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'multiselect',
        message: 'Which components would you like to eject?',
      }),
      expect.anything(),
    )
    expect(result.components).toEqual(['button'])
    const written = path.join(cwd, 'src', 'components', 'ui', 'button.ts')
    expect(await fs.readFile(written, 'utf-8')).toContain('buttonFixture')
  })

  it('skips an existing file when the user declines the overwrite prompt', async () => {
    vi.stubEnv(REGISTRY_URL_ENV_VAR, 'https://r.example.com/r')
    mockRegistry('https://r.example.com/r')
    const cwd = await createProjectFixtures()
    projectDirs.push(cwd)

    const target = path.join(cwd, 'src', 'components', 'ui', 'button.ts')
    await fs.mkdir(path.dirname(target), { recursive: true })
    await fs.writeFile(target, '// user-owned content\n')
    promptsMock.mockResolvedValue({ value: false })

    const result = await runEject({
      components: ['button'],
      yes: false,
      overwrite: false,
      cwd,
    })

    expect(await fs.readFile(target, 'utf-8')).toBe('// user-owned content\n')
    expect(result.filesSkipped).toEqual([
      path.join('src', 'components', 'ui', 'button.ts'),
    ])
    expect(result.filesEjected).toEqual([
      path.join('src', 'lib', 'button-helpers.ts'),
    ])
  })

  it('overwrites an existing file when --overwrite is passed', async () => {
    vi.stubEnv(REGISTRY_URL_ENV_VAR, 'https://r.example.com/r')
    mockRegistry('https://r.example.com/r')
    const cwd = await createProjectFixtures()
    projectDirs.push(cwd)

    const target = path.join(cwd, 'src', 'components', 'ui', 'button.ts')
    await fs.mkdir(path.dirname(target), { recursive: true })
    await fs.writeFile(target, '// legacy content\n')

    const result = await runEject({
      components: ['button'],
      yes: false,
      overwrite: true,
      cwd,
    })

    expect(await fs.readFile(target, 'utf-8')).toBe(
      'export const buttonFixture = true\n',
    )
    expect(result.filesEjected).toContain(
      path.join('src', 'components', 'ui', 'button.ts'),
    )
    expect(result.filesSkipped).toEqual([])
  })

  it('overwrites an existing file with --yes without prompting', async () => {
    vi.stubEnv(REGISTRY_URL_ENV_VAR, 'https://r.example.com/r')
    mockRegistry('https://r.example.com/r')
    const cwd = await createProjectFixtures()
    projectDirs.push(cwd)

    const target = path.join(cwd, 'src', 'components', 'ui', 'button.ts')
    await fs.mkdir(path.dirname(target), { recursive: true })
    await fs.writeFile(target, '// legacy content\n')
    // Even if the mock would decline, --yes must skip the prompt entirely.
    promptsMock.mockResolvedValue({ value: false })

    const result = await runEject({
      components: ['button'],
      yes: true,
      overwrite: false,
      cwd,
    })

    expect(await fs.readFile(target, 'utf-8')).toBe(
      'export const buttonFixture = true\n',
    )
    expect(promptsMock).not.toHaveBeenCalled()
    expect(result.filesSkipped).toEqual([])
  })

  it('rejects with DepNotFoundError for an unknown component', async () => {
    vi.stubEnv(REGISTRY_URL_ENV_VAR, 'https://r.example.com/r')
    mockRegistry('https://r.example.com/r')
    const cwd = await createProjectFixtures()
    projectDirs.push(cwd)

    await expect(
      runEject({
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
    const cwd = path.join(os.tmpdir(), 'shadcn-eject-does-not-exist')

    await expect(
      runEject({
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

// ── eject command (commander wiring) ──────────────────────────────────────────

describe('eject command', () => {
  it('registers the eject command shape', () => {
    expect(eject.name()).toBe('eject')
    expect(eject.description()).toBe('eject components as editable source files')

    const help = eject.helpInformation()
    expect(help).toContain('[components...]')
    expect(help).toContain('-y, --yes')
    expect(help).toContain('-o, --overwrite')
    expect(help).toContain('-c, --cwd <cwd>')
  })
})
