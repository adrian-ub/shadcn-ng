import type { RegistryIndex } from '../../src/registry/schemas'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { z } from 'zod'

import { view } from '../../src/cli/commands/view'
import { ViewOptionsSchema } from '../../src/cli/schemas/view'
import { renderSourceFile, runView } from '../../src/cli/stages/run-view'
import { DepNotFoundError } from '../../src/registry/errors'
import { REGISTRY_URL_ENV_VAR } from '../../src/registry/source'

// ── P3.T4: view command — display a registry component's raw source ───────────

const mockFetch = vi.fn()

vi.mock('node-fetch', () => ({
  default: (...args: unknown[]) => mockFetch(...args),
}))

// Fixture registry: `button` carries two source files, `plain` has none.
const index: RegistryIndex = [
  {
    name: 'button',
    type: 'registry:ui',
    title: 'Button',
    files: [
      {
        path: 'button.ts',
        type: 'registry:ui',
        content: 'export const button = true\n',
      },
      {
        path: 'button.spec.ts',
        type: 'registry:ui',
        content: 'describe(button, () => {})\n',
      },
    ],
  },
  {
    name: 'plain',
    type: 'registry:ui',
    title: 'Plain',
    files: [],
  },
]

function mockRegistry(baseUrl: string): void {
  const payloads: Record<string, unknown> = {
    [`${baseUrl}/index.json`]: index,
    [`${baseUrl}/styles/new-york/button.json`]: index[0],
    [`${baseUrl}/styles/new-york/plain.json`]: index[1],
  }
  mockFetch.mockImplementation(async (url: string) => ({
    ok: true,
    status: 200,
    statusText: 'OK',
    json: async () => payloads[url],
  }))
}

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.clearAllMocks()
})

// ── ViewOptionsSchema ──────────────────────────────────────────────────────────

describe('viewOptionsSchema', () => {
  it('parses a view invocation with a component and cwd', () => {
    const parsed = ViewOptionsSchema.parse({
      component: 'button',
      cwd: '/tmp/project',
    })

    expect(parsed).toEqual({ component: 'button', cwd: '/tmp/project' })
  })

  it('rejects an invocation without a component', () => {
    expect(() => ViewOptionsSchema.parse({ cwd: '/tmp/project' })).toThrow(
      z.ZodError,
    )
  })

  it('rejects an empty component name', () => {
    expect(() =>
      ViewOptionsSchema.parse({ component: '', cwd: '/tmp/project' }),
    ).toThrow(z.ZodError)
  })

  it('rejects a missing cwd with a ZodError', () => {
    expect(() => ViewOptionsSchema.parse({ component: 'button' })).toThrow(
      z.ZodError,
    )
  })
})

// ── renderSourceFile (pure) ────────────────────────────────────────────────────

describe('renderSourceFile', () => {
  it('renders a header line followed by the raw file content', () => {
    const rendered = renderSourceFile(index[0].files![0])

    expect(rendered).toBe(
      '=== button.ts ===\nexport const button = true\n',
    )
  })

  it('renders an empty body for a file without content', () => {
    expect(renderSourceFile({ path: 'empty.ts' })).toBe('=== empty.ts ===\n')
  })
})

// ── runView ────────────────────────────────────────────────────────────────────

describe('runView', () => {
  it('resolves a component and prints its raw source files', async () => {
    vi.stubEnv(REGISTRY_URL_ENV_VAR, 'https://r.example.com/r')
    mockRegistry('https://r.example.com/r')
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    const result = await runView({ component: 'button', cwd: '/tmp/project' })

    expect(result.component).toBe('button')
    expect(result.files.map(file => file.path)).toEqual([
      'button.ts',
      'button.spec.ts',
    ])

    const output = logSpy.mock.calls.flat().join('\n')
    expect(output).toContain('=== button.ts ===')
    expect(output).toContain('export const button = true')
    expect(output).toContain('=== button.spec.ts ===')
    expect(output).toContain('describe(button, () => {})')
  })

  it('warns when the component has no source files', async () => {
    vi.stubEnv(REGISTRY_URL_ENV_VAR, 'https://r.example.com/r')
    mockRegistry('https://r.example.com/r')
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    const result = await runView({ component: 'plain', cwd: '/tmp/project' })

    expect(result.files).toEqual([])
    expect(logSpy.mock.calls.flat().join('\n')).toContain(
      'has no source files',
    )
  })

  it('rejects with DepNotFoundError for an unknown component', async () => {
    vi.stubEnv(REGISTRY_URL_ENV_VAR, 'https://r.example.com/r')
    mockRegistry('https://r.example.com/r')

    await expect(
      runView({ component: 'ghost', cwd: '/tmp/project' }),
    ).rejects.toThrow(DepNotFoundError)
  })
})

// ── view command (commander wiring) ────────────────────────────────────────────

describe('view command', () => {
  it('registers the view command shape', () => {
    expect(view.name()).toBe('view')
    expect(view.description()).toContain('view')

    const help = view.helpInformation()
    expect(help).toContain('<component>')
    expect(help).toContain('-c, --cwd <cwd>')
  })
})
