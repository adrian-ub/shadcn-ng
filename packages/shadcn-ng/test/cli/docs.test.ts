import type { RegistryIndex } from '../../src/registry/schemas'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { z } from 'zod'

import { docs } from '../../src/cli/commands/docs'
import { DocsOptionsSchema } from '../../src/cli/schemas/docs'
import {
  getOpenCommand,
  openUrl,
  resolveDocsUrl,
  runDocs,
} from '../../src/cli/stages/run-docs'
import { DepNotFoundError } from '../../src/registry/errors'
import { REGISTRY_URL_ENV_VAR } from '../../src/registry/source'

// ── P3.T2: docs command — resolve component docs URL and open it ─────────────

const mockFetch = vi.fn()

vi.mock('node-fetch', () => ({
  default: (...args: unknown[]) => mockFetch(...args),
}))

// Opening a URL must never touch a real browser during tests.
const spawnMock = vi.fn((..._args: unknown[]) => ({
  unref: vi.fn(),
  on: vi.fn(),
}))

vi.mock('node:child_process', () => ({
  spawn: (...args: unknown[]) => spawnMock(...args),
}))

// Fixture registry: two documented components and one without a docs link.
const index: RegistryIndex = [
  {
    name: 'button',
    type: 'registry:ui',
    title: 'Button',
    docs: 'https://ui.adrianub.dev/docs/components/button',
  },
  {
    name: 'dialog',
    type: 'registry:ui',
    title: 'Dialog',
    docs: 'https://ui.adrianub.dev/docs/components/dialog',
  },
  {
    name: 'plain',
    type: 'registry:ui',
    title: 'Plain',
    docs: undefined,
  },
]

function mockRegistry(baseUrl: string): void {
  mockFetch.mockImplementation(async (url: string) => ({
    ok: true,
    status: 200,
    statusText: 'OK',
    json: async () => (url === `${baseUrl}/index.json` ? index : null),
  }))
}

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.clearAllMocks()
})

// ── DocsOptionsSchema ─────────────────────────────────────────────────────────

describe('docsOptionsSchema', () => {
  it('parses a docs invocation with components and cwd', () => {
    const parsed = DocsOptionsSchema.parse({
      components: ['button'],
      cwd: '/tmp/project',
    })

    expect(parsed).toEqual({
      components: ['button'],
      cwd: '/tmp/project',
    })
  })

  it('rejects an invocation without components', () => {
    expect(() => DocsOptionsSchema.parse({ cwd: '/tmp/project' })).toThrow(
      z.ZodError,
    )
  })

  it('rejects a non-array components value with a ZodError', () => {
    expect(() =>
      DocsOptionsSchema.parse({
        components: 'button',
        cwd: '/tmp/project',
      }),
    ).toThrow(z.ZodError)
  })
})

// ── resolveDocsUrl ────────────────────────────────────────────────────────────

describe('resolveDocsUrl', () => {
  it('returns the docs URL for a known component', () => {
    expect(resolveDocsUrl(index, 'button')).toBe(
      'https://ui.adrianub.dev/docs/components/button',
    )
  })

  it('returns the docs URL for a different component', () => {
    expect(resolveDocsUrl(index, 'dialog')).toBe(
      'https://ui.adrianub.dev/docs/components/dialog',
    )
  })

  it('throws DepNotFoundError for an unknown component', () => {
    expect(() => resolveDocsUrl(index, 'ghost')).toThrow(DepNotFoundError)
  })

  it('throws when the component has no docs link', () => {
    expect(() => resolveDocsUrl(index, 'plain')).toThrow(
      /No documentation link available/,
    )
  })
})

// ── getOpenCommand ────────────────────────────────────────────────────────────

describe('getOpenCommand', () => {
  it('uses `open` on darwin', () => {
    expect(getOpenCommand('darwin')).toEqual({ command: 'open', args: [] })
  })

  it('uses `xdg-open` on linux', () => {
    expect(getOpenCommand('linux')).toEqual({
      command: 'xdg-open',
      args: [],
    })
  })

  it('uses `start` via cmd on win32', () => {
    expect(getOpenCommand('win32')).toEqual({
      command: 'cmd',
      args: ['/c', 'start', ''],
    })
  })
})

// ── openUrl ───────────────────────────────────────────────────────────────────

describe('openUrl', () => {
  it('spawns the platform opener with the docs URL', () => {
    openUrl('https://ui.adrianub.dev/docs/components/button')

    expect(spawnMock).toHaveBeenCalledTimes(1)
    const [command, args, options] = spawnMock.mock.calls[0]
    expect(command).toBe('open')
    expect(args).toContain('https://ui.adrianub.dev/docs/components/button')
    expect(options).toMatchObject({ detached: true, stdio: 'ignore' })
  })
})

// ── runDocs ───────────────────────────────────────────────────────────────────

describe('runDocs', () => {
  it('resolves the docs URL for a component and opens it', async () => {
    vi.stubEnv(REGISTRY_URL_ENV_VAR, 'https://r.example.com/r')
    mockRegistry('https://r.example.com/r')

    const result = await runDocs({
      components: ['button'],
      cwd: '/tmp/project',
    })

    expect(result.components).toEqual(['button'])
    expect(result.urls).toEqual([
      'https://ui.adrianub.dev/docs/components/button',
    ])
    expect(spawnMock).toHaveBeenCalledTimes(1)
  })

  it('resolves and opens docs for multiple components', async () => {
    vi.stubEnv(REGISTRY_URL_ENV_VAR, 'https://r.example.com/r')
    mockRegistry('https://r.example.com/r')

    const result = await runDocs({
      components: ['button', 'dialog'],
      cwd: '/tmp/project',
    })

    expect(result.urls).toEqual([
      'https://ui.adrianub.dev/docs/components/button',
      'https://ui.adrianub.dev/docs/components/dialog',
    ])
    expect(spawnMock).toHaveBeenCalledTimes(2)
  })

  it('rejects with DepNotFoundError for an unknown component', async () => {
    vi.stubEnv(REGISTRY_URL_ENV_VAR, 'https://r.example.com/r')
    mockRegistry('https://r.example.com/r')

    await expect(
      runDocs({ components: ['ghost'], cwd: '/tmp/project' }),
    ).rejects.toThrow(DepNotFoundError)
  })
})

// ── docs command (commander wiring) ───────────────────────────────────────────

describe('docs command', () => {
  it('registers the docs command shape', () => {
    expect(docs.name()).toBe('docs')
    expect(docs.description()).toBe('open the documentation for a component')

    const help = docs.helpInformation()
    expect(help).toContain('<components...>')
    expect(help).toContain('-c, --cwd <cwd>')
  })
})
