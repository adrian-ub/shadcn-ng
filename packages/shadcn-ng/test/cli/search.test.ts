import type { RegistryIndex } from '../../src/registry/schemas'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { z } from 'zod'

import { search } from '../../src/cli/commands/search'
import { SearchOptionsSchema } from '../../src/cli/schemas/search'
import {
  formatSearchItem,
  formatSearchResultDescription,
  formatSearchResultType,
  runSearch,
  searchIndex,
} from '../../src/cli/stages/run-search'
import { REGISTRY_URL_ENV_VAR } from '../../src/registry/source'

// ── P3.T4: search command — fuzzy-search the registry index ───────────────────

const mockFetch = vi.fn()

vi.mock('node-fetch', () => ({
  default: (...args: unknown[]) => mockFetch(...args),
}))

// Fixture registry: five components, three with descriptions. `badge` has no
// description and `dialog`'s description carries the word "modal".
const index: RegistryIndex = [
  {
    name: 'button',
    type: 'registry:ui',
    description: 'A button component',
  },
  {
    name: 'dialog',
    type: 'registry:ui',
    description: 'A modal dialog with overlay',
  },
  {
    name: 'card',
    type: 'registry:ui',
    description: 'A card container',
  },
  {
    name: 'badge',
    type: 'registry:ui',
  },
  {
    name: 'skeleton',
    type: 'registry:ui',
    description: 'Loading placeholder',
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

// ── SearchOptionsSchema ───────────────────────────────────────────────────────

describe('searchOptionsSchema', () => {
  it('parses a search invocation with a query and cwd', () => {
    const parsed = SearchOptionsSchema.parse({
      query: 'dialog',
      cwd: '/tmp/project',
    })

    expect(parsed).toEqual({ query: 'dialog', cwd: '/tmp/project' })
  })

  it('treats the query as optional (no query lists everything)', () => {
    const parsed = SearchOptionsSchema.parse({ cwd: '/tmp/project' })

    expect(parsed.query).toBeUndefined()
    expect(parsed.cwd).toBe('/tmp/project')
  })

  it('rejects a non-string query with a ZodError', () => {
    expect(() =>
      SearchOptionsSchema.parse({ query: 42, cwd: '/tmp/project' }),
    ).toThrow(z.ZodError)
  })

  it('rejects a missing cwd with a ZodError', () => {
    expect(() => SearchOptionsSchema.parse({ query: 'dialog' })).toThrow(
      z.ZodError,
    )
  })
})

// ── searchIndex (pure) ─────────────────────────────────────────────────────────

describe('searchIndex', () => {
  it('ranks an exact name match first', () => {
    const results = searchIndex(index, 'button')

    expect(results.length).toBeGreaterThan(0)
    expect(results[0].name).toBe('button')
  })

  it('matches a partial name fragment', () => {
    const results = searchIndex(index, 'dial')

    expect(results.length).toBeGreaterThan(0)
    expect(results.map(result => result.name)).toContain('dialog')
  })

  it('matches against descriptions, not just names', () => {
    const results = searchIndex(index, 'modal')

    expect(results.length).toBeGreaterThan(0)
    expect(results[0].name).toBe('dialog')
  })

  it('returns every item unchanged for an empty query', () => {
    expect(searchIndex(index, '')).toEqual(index)
    expect(searchIndex(index, '   ')).toEqual(index)
  })

  it('returns no results for a query that matches nothing', () => {
    expect(searchIndex(index, 'zzzz')).toEqual([])
  })
})

// ── formatSearchResultType (pure) ──────────────────────────────────────────────

describe('formatSearchResultType', () => {
  it('strips the registry: prefix from a namespaced type', () => {
    expect(formatSearchResultType('registry:ui')).toBe('ui')
    expect(formatSearchResultType('registry:block')).toBe('block')
  })

  it('passes a short-form type through unchanged', () => {
    expect(formatSearchResultType('ui')).toBe('ui')
  })
})

// ── formatSearchResultDescription (pure) ───────────────────────────────────────

describe('formatSearchResultDescription', () => {
  it('keeps a short description as-is', () => {
    expect(formatSearchResultDescription('A button component')).toBe(
      'A button component',
    )
  })

  it('normalizes whitespace inside the description', () => {
    expect(formatSearchResultDescription('  A   button   component  ')).toBe(
      'A button component',
    )
  })

  it('truncates a long description to the default 80 characters with an ellipsis', () => {
    const longDescription = `A very long component description ${'that goes on and on '.repeat(
      6,
    )}past the limit`
    const truncated = formatSearchResultDescription(longDescription)

    expect(truncated.length).toBeLessThanOrEqual(80)
    expect(truncated.endsWith('...')).toBe(true)
  })
})

// ── formatSearchItem (pure) ────────────────────────────────────────────────────

describe('formatSearchItem', () => {
  it('formats a component with its type and description', () => {
    expect(formatSearchItem(index[0])).toBe(
      '- button (ui) — A button component',
    )
  })

  it('omits the description segment when none exists', () => {
    const line = formatSearchItem(index[3])
    expect(line).toBe('- badge (ui)')
  })
})

// ── runSearch ──────────────────────────────────────────────────────────────────

describe('runSearch', () => {
  it('displays matching components with descriptions (spec R7)', async () => {
    vi.stubEnv(REGISTRY_URL_ENV_VAR, 'https://r.example.com/r')
    mockRegistry('https://r.example.com/r')
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    const result = await runSearch({
      query: 'dialog',
      cwd: '/tmp/project',
    })

    expect(result.total).toBeGreaterThan(0)
    expect(result.items[0].name).toBe('dialog')

    const output = logSpy.mock.calls.flat().join('\n')
    expect(output).toContain('dialog')
    expect(output).toContain('A modal dialog with overlay')
  })

  it('warns and returns empty results when nothing matches', async () => {
    vi.stubEnv(REGISTRY_URL_ENV_VAR, 'https://r.example.com/r')
    mockRegistry('https://r.example.com/r')
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    const result = await runSearch({ query: 'zzzz', cwd: '/tmp/project' })

    expect(result.total).toBe(0)
    expect(result.items).toEqual([])
    expect(logSpy.mock.calls.flat().join('\n')).toContain('No components found')
  })

  it('returns every component when no query is provided', async () => {
    vi.stubEnv(REGISTRY_URL_ENV_VAR, 'https://r.example.com/r')
    mockRegistry('https://r.example.com/r')

    const result = await runSearch({ cwd: '/tmp/project' })

    expect(result.total).toBe(index.length)
    expect(result.items.map(item => item.name)).toEqual(
      index.map(item => item.name),
    )
  })
})

// ── search command (commander wiring) ──────────────────────────────────────────

describe('search command', () => {
  it('registers the search command shape', () => {
    expect(search.name()).toBe('search')
    expect(search.description()).toContain('search')

    const help = search.helpInformation()
    expect(help).toContain('[query]')
    expect(help).toContain('-c, --cwd <cwd>')
  })
})
