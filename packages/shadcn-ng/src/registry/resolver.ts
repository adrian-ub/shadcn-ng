import deepmerge from 'deepmerge'
import { z } from 'zod'
import { CycleError, DepNotFoundError, SchemaError } from './errors'
import { RegistryFetcher } from './fetcher'
import {
  registryIndexSchema,
  registryItemSchema,
  registryResolvedItemsTreeSchema,
  type RegistryIndex,
  type RegistryItem,
  type RegistryResolvedItemsTree,
} from './schemas'
import {
  getRegistryBaseUrl,
  resolveRegistrySource,
  type RegistrySource,
} from './source'

// ── Types ───────────────────────────────────────────────────────────────────

/**
 * A resolved registry tree: the merged installation payload for a set of
 * registry items plus the items themselves in dependency-first DFS order.
 */
export interface ResolvedTree extends RegistryResolvedItemsTree {
  /** Resolved items in dependency-first DFS order, deduplicated by name. */
  items: RegistryItem[]
}

/**
 * The registry resolver contract: fetch and validate the registry index and
 * resolve components together with their transitive registry dependencies.
 */
export interface RegistryResolver {
  resolve(
    names: string[],
    source?: RegistrySource | string,
  ): Promise<ResolvedTree>
  getIndex(source?: RegistrySource | string): Promise<RegistryIndex>
}

export interface RegistryResolverOptions {
  /**
   * Default registry source. Accepts a parsed {@link RegistrySource} or a
   * raw config value (see `parseRegistrySource`). The `SHADCN_REGISTRY_URL`
   * environment variable always takes precedence at call time.
   */
  source?: RegistrySource | string
  /**
   * Registry style used for item paths (e.g. `styles/{style}/{name}.json`).
   * Defaults to `new-york`.
   */
  style?: string
}

// ── RegistryResolver ────────────────────────────────────────────────────────

/**
 * Resolves registry components from a multi-source registry (GitHub raw,
 * direct URL, or `SHADCN_REGISTRY_URL` override).
 *
 * - `getIndex` fetches and zod-validates the registry index.
 * - `resolve` walks the registry dependency graph in DFS order with cycle
 *   detection and deduplication, fetches each unique item payload, and
 *   merges them into a {@link ResolvedTree}.
 */
export class RegistryResolver implements RegistryResolver {
  private readonly source: RegistrySource | string | undefined
  private readonly style: string
  private fetcher: RegistryFetcher | undefined
  private fetcherBaseUrl: string | undefined

  constructor(options: RegistryResolverOptions = {}) {
    this.source = options.source
    this.style = options.style ?? 'new-york'
  }

  /**
   * Fetches and validates the registry index from the effective source.
   *
   * @throws {FetchError} On network failure or a malformed registry URL.
   * @throws {SchemaError} When the index JSON fails zod validation.
   */
  async getIndex(source?: RegistrySource | string): Promise<RegistryIndex> {
    const effective = resolveRegistrySource(source ?? this.source)
    const fetcher = this.getFetcher(effective)
    const data = await fetcher.fetchJson<unknown>('index.json')

    const parsed = registryIndexSchema.safeParse(data)
    if (!parsed.success) {
      throw new SchemaError(
        `Invalid registry index:\n${formatZodIssues(parsed.error)}`,
      )
    }

    return parsed.data
  }

  /**
   * Resolves registry items and their transitive registry dependencies.
   *
   * The returned tree lists items in dependency-first DFS order (a component
   * that depends on B depends on C resolves to `[C, B, A]`) and merges their
   * dependencies, files, tailwind, cssVars, and docs into the installation
   * payload.
   *
   * @throws {DepNotFoundError} When a requested or dependency name is missing
   *   from the registry index.
   * @throws {CycleError} When the registry dependency graph contains a cycle.
   * @throws {SchemaError} When the index or an item payload fails validation.
   * @throws {FetchError} On network failure or a malformed registry URL.
   */
  async resolve(
    names: string[],
    source?: RegistrySource | string,
  ): Promise<ResolvedTree> {
    const index = await this.getIndex(source)
    const ordered = resolveDependencyOrder(index, names)

    const effective = resolveRegistrySource(source ?? this.source)
    const fetcher = this.getFetcher(effective)

    const items = await Promise.all(
      ordered.map(async (name) => {
        const data = await fetcher.fetchJson<unknown>(
          `styles/${this.style}/${name}.json`,
        )
        const parsed = registryItemSchema.safeParse(data)
        if (!parsed.success) {
          throw new SchemaError(
            `Invalid registry item "${name}":\n${formatZodIssues(parsed.error)}`,
          )
        }
        return parsed.data
      }),
    )

    const merged = {
      dependencies: deepmerge.all(
        items.map(item => item.dependencies ?? []),
      ),
      devDependencies: deepmerge.all(
        items.map(item => item.devDependencies ?? []),
      ),
      files: deepmerge.all(items.map(item => item.files ?? [])),
      tailwind: deepmerge.all(items.map(item => item.tailwind ?? {})),
      cssVars: deepmerge.all(items.map(item => item.cssVars ?? {})),
      docs: items
        .map(item => item.docs ?? '')
        .filter(docs => docs.length > 0)
        .join('\n'),
    }

    const parsedTree = registryResolvedItemsTreeSchema.safeParse(merged)
    if (!parsedTree.success) {
      throw new SchemaError(
        `Invalid resolved registry tree:\n${formatZodIssues(parsedTree.error)}`,
      )
    }

    return {
      ...parsedTree.data,
      items,
    }
  }

  private getFetcher(source: RegistrySource): RegistryFetcher {
    const baseUrl = getRegistryBaseUrl(source)
    if (this.fetcher && this.fetcherBaseUrl === baseUrl) {
      return this.fetcher
    }

    this.fetcher = new RegistryFetcher({ registryUrl: baseUrl })
    this.fetcherBaseUrl = baseUrl
    return this.fetcher
  }
}

// ── Dependency graph traversal ──────────────────────────────────────────────

/**
 * Walks the registry dependency graph in DFS order, returning the unique
 * item names with dependencies before dependents.
 *
 * @throws {DepNotFoundError} When a name is missing from the index.
 * @throws {CycleError} When the graph contains a cycle.
 */
export function resolveDependencyOrder(
  index: RegistryIndex,
  names: string[],
): string[] {
  const indexByName = new Map(index.map(item => [item.name, item]))
  const ordered: string[] = []
  const visited = new Set<string>()
  const path: string[] = []

  function visit(name: string): void {
    if (visited.has(name)) {
      return
    }

    const item = indexByName.get(name)
    if (!item) {
      throw new DepNotFoundError(name)
    }

    const cycleStart = path.indexOf(name)
    if (cycleStart !== -1) {
      throw new CycleError([...path.slice(cycleStart), name])
    }

    path.push(name)
    for (const dependency of item.registryDependencies ?? []) {
      visit(dependency)
    }
    path.pop()

    visited.add(name)
    ordered.push(name)
  }

  for (const name of names) {
    visit(name)
  }

  return ordered
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function formatZodIssues(error: z.ZodError): string {
  return error.errors
    .map((issue) => {
      const issuePath = issue.path.length ? issue.path.join('.') : '(root)'
      return `  - ${issuePath}: ${issue.message}`
    })
    .join('\n')
}
