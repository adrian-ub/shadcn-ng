import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  REGISTRY_URL_ENV_VAR,
} from '../../src/registry/source'
import {
  RegistryResolver,
  resolveDependencyOrder,
} from '../../src/registry/resolver'
import type { RegistryIndex } from '../../src/registry/schemas'
import {
  CycleError,
  DepNotFoundError,
  SchemaError,
} from '../../src/registry/errors'

// ── P2.T4b: RegistryResolver — DFS resolution with cycle detection ─────────

const mockFetch = vi.fn()

vi.mock('node-fetch', () => ({
  default: (...args: unknown[]) => mockFetch(...args),
}))

// A depends on B, B depends on C. DFS must return dependencies first: C, B, A.
const index: RegistryIndex = [
  {
    name: 'C',
    type: 'registry:ui',
    dependencies: ['@angular/core'],
    files: [{ path: 'c.ts', type: 'registry:ui' as const }],
  },
  {
    name: 'B',
    type: 'registry:ui',
    registryDependencies: ['C'],
    dependencies: ['lucide-angular'],
    files: [{ path: 'b.ts', type: 'registry:ui' as const }],
  },
  {
    name: 'A',
    type: 'registry:ui',
    registryDependencies: ['B'],
    dependencies: ['@angular/forms'],
    docs: 'Docs for A',
    tailwind: {
      config: {
        theme: { extend: { colors: { brand: '#a00' } } },
      },
    },
    files: [{ path: 'a.ts', type: 'registry:ui' as const }],
  },
]

function mockRegistry(
  payloads: Record<string, unknown>,
): void {
  mockFetch.mockImplementation(async (url: string) => ({
    ok: true,
    status: 200,
    statusText: 'OK',
    json: async () => payloads[url],
  }))
}

function buildPayloads(
  baseUrl: string,
  items: RegistryIndex = index,
): Record<string, unknown> {
  const payloads: Record<string, unknown> = {
    [`${baseUrl}/index.json`]: items,
  }
  for (const item of items) {
    payloads[`${baseUrl}/styles/new-york/${item.name}.json`] = item
  }
  return payloads
}

function itemFetchUrls(): string[] {
  return mockFetch.mock.calls
    .map(([url]) => String(url))
    .filter(url => url.includes('/styles/'))
}

describe('RegistryResolver.getIndex', () => {
  let resolver: RegistryResolver

  beforeEach(() => {
    vi.clearAllMocks()
    resolver = new RegistryResolver({ source: 'https://r.example.com/r' })
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.clearAllMocks()
  })

  it('fetches and validates the registry index from the configured source', async () => {
    mockRegistry(buildPayloads('https://r.example.com/r'))

    const result = await resolver.getIndex()

    expect(result).toEqual(index)
    expect(mockFetch).toHaveBeenCalledWith(
      'https://r.example.com/r/index.json',
      expect.anything(),
    )
  })

  it('fetches the index from a GitHub raw source', async () => {
    mockRegistry(buildPayloads('https://raw.githubusercontent.com/user/repo/tags'))
    const githubResolver = new RegistryResolver({
      source: 'github.com/user/repo/tags',
    })

    const result = await githubResolver.getIndex()

    expect(result).toEqual(index)
    expect(mockFetch).toHaveBeenCalledWith(
      'https://raw.githubusercontent.com/user/repo/tags/index.json',
      expect.anything(),
    )
  })

  it('lets SHADCN_REGISTRY_URL override the configured source', async () => {
    vi.stubEnv(REGISTRY_URL_ENV_VAR, 'https://env.example.com/r')
    mockRegistry(buildPayloads('https://env.example.com/r'))

    const result = await resolver.getIndex()

    expect(result).toEqual(index)
    expect(mockFetch).toHaveBeenCalledWith(
      'https://env.example.com/r/index.json',
      expect.anything(),
    )
  })

  it('throws SchemaError when the index fails validation', async () => {
    mockRegistry({
      'https://r.example.com/r/index.json': { name: 'not-an-array' },
    })

    await expect(resolver.getIndex()).rejects.toThrow(SchemaError)
    await expect(resolver.getIndex()).rejects.toThrow(/index/i)
  })

  it('throws FetchError for a malformed registry URL', async () => {
    const badResolver = new RegistryResolver({ source: '!!!not-a-source!!!' })

    await expect(badResolver.getIndex()).rejects.toThrow(/Invalid registry URL/)
  })
})

describe('RegistryResolver.resolve', () => {
  let resolver: RegistryResolver

  beforeEach(() => {
    vi.clearAllMocks()
    resolver = new RegistryResolver({ source: 'https://r.example.com/r' })
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.clearAllMocks()
  })

  it('resolves a dependency chain in DFS order with dependencies first', async () => {
    mockRegistry(buildPayloads('https://r.example.com/r'))

    const tree = await resolver.resolve(['A'])

    expect(tree.items.map(item => item.name)).toEqual(['C', 'B', 'A'])
    // Every item payload is fetched exactly once from the resolved source.
    const urls = itemFetchUrls()
    expect(urls.sort()).toEqual([
      'https://r.example.com/r/styles/new-york/A.json',
      'https://r.example.com/r/styles/new-york/B.json',
      'https://r.example.com/r/styles/new-york/C.json',
    ])
  })

  it('deduplicates shared dependencies across branches', async () => {
    // A depends on B and C; B also depends on C.
    const branchingIndex: RegistryIndex = [
      { name: 'C', type: 'registry:ui', dependencies: ['@angular/core'] },
      { name: 'B', type: 'registry:ui', registryDependencies: ['C'] },
      {
        name: 'A',
        type: 'registry:ui',
        registryDependencies: ['B', 'C'],
      },
    ]
    mockRegistry(buildPayloads('https://r.example.com/r', branchingIndex))

    const tree = await resolver.resolve(['A'])

    expect(tree.items.map(item => item.name)).toEqual(['C', 'B', 'A'])
    // C fetched once despite being reachable via B and directly.
    const urls = itemFetchUrls()
    expect(new Set(urls)).toHaveLength(3)
    expect(urls).toHaveLength(3)
  })

  it('deduplicates repeated root names', async () => {
    mockRegistry(buildPayloads('https://r.example.com/r'))

    const tree = await resolver.resolve(['A', 'A'])

    expect(tree.items.map(item => item.name)).toEqual(['C', 'B', 'A'])
    expect(itemFetchUrls()).toHaveLength(3)
  })

  it('merges dependencies, files, tailwind, and docs into the resolved tree', async () => {
    mockRegistry(buildPayloads('https://r.example.com/r'))

    const tree = await resolver.resolve(['A'])

    expect(tree.dependencies).toEqual([
      '@angular/core',
      'lucide-angular',
      '@angular/forms',
    ])
    expect(tree.files?.map(file => file.path)).toEqual(['c.ts', 'b.ts', 'a.ts'])
    expect(tree.tailwind?.config?.theme).toEqual({
      extend: { colors: { brand: '#a00' } },
    })
    expect(tree.docs).toBe('Docs for A')
  })

  it('throws DepNotFoundError when a dependency is missing from the index', async () => {
    const missingDepIndex: RegistryIndex = [
      {
        name: 'A',
        type: 'registry:ui',
        registryDependencies: ['ghost'],
      },
    ]
    mockRegistry(buildPayloads('https://r.example.com/r', missingDepIndex))

    try {
      await resolver.resolve(['A'])
      expect.unreachable('Should have thrown')
    }
    catch (error) {
      expect(error).toBeInstanceOf(DepNotFoundError)
      if (error instanceof DepNotFoundError) {
        expect(error.dependencyName).toBe('ghost')
        expect(error.message).toContain('ghost')
      }
    }
  })

  it('throws DepNotFoundError for an unknown root name', async () => {
    mockRegistry(buildPayloads('https://r.example.com/r'))

    await expect(resolver.resolve(['nope'])).rejects.toThrow(DepNotFoundError)
  })

  it('throws CycleError on circular registry dependencies', async () => {
    const cyclicIndex: RegistryIndex = [
      { name: 'B', type: 'registry:ui', registryDependencies: ['A'] },
      { name: 'A', type: 'registry:ui', registryDependencies: ['B'] },
    ]
    mockRegistry(buildPayloads('https://r.example.com/r', cyclicIndex))

    try {
      await resolver.resolve(['A'])
      expect.unreachable('Should have thrown')
    }
    catch (error) {
      expect(error).toBeInstanceOf(CycleError)
      if (error instanceof CycleError) {
        expect(error.cycle).toEqual(['A', 'B', 'A'])
        expect(error.message).toContain('A → B → A')
      }
    }
  })

  it('throws SchemaError when an item payload fails validation', async () => {
    mockRegistry({
      'https://r.example.com/r/index.json': [
        { name: 'A', type: 'registry:ui' },
      ],
      'https://r.example.com/r/styles/new-york/A.json': {
        name: 'A',
        // missing required `type`
      },
    })

    await expect(resolver.resolve(['A'])).rejects.toThrow(SchemaError)
  })
})

describe('resolveDependencyOrder (pure)', () => {
  it('returns dependency-first DFS order for a chain A -> B -> C', () => {
    expect(resolveDependencyOrder(index, ['A'])).toEqual(['C', 'B', 'A'])
  })

  it('visits each dependency only once across multiple roots', () => {
    expect(resolveDependencyOrder(index, ['A', 'C'])).toEqual(['C', 'B', 'A'])
  })

  it('throws DepNotFoundError for a missing dependency', () => {
    const missingDepIndex: RegistryIndex = [
      {
        name: 'A',
        type: 'registry:ui',
        registryDependencies: ['ghost'],
      },
    ]
    expect(() => resolveDependencyOrder(missingDepIndex, ['A'])).toThrow(
      DepNotFoundError,
    )
  })

  it('throws CycleError for circular dependencies', () => {
    const cyclicIndex: RegistryIndex = [
      { name: 'B', type: 'registry:ui', registryDependencies: ['A'] },
      { name: 'A', type: 'registry:ui', registryDependencies: ['B'] },
    ]
    expect(() => resolveDependencyOrder(cyclicIndex, ['A'])).toThrow(CycleError)
  })
})
