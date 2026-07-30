import fetch from 'node-fetch'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { FetchError } from './errors'
import { TTLCache } from './cache'

// ── Types ───────────────────────────────────────────────────────────────────

export interface RegistryFetcherOptions {
  /** Base URL for the registry (default: see RegistryFetcher constructor) */
  registryUrl?: string
  /** Cache TTL in milliseconds (default: 5 minutes) */
  ttlMs?: number
}

// ── RegistryFetcher ─────────────────────────────────────────────────────────

/**
 * HTTP fetcher for registry resources with TTL-based caching,
 * proxy support, and multi-source URL resolution.
 *
 * Supports:
 * - Relative paths (resolved against the base registry URL)
 * - Absolute URLs (passed through as-is, e.g. GitHub raw URLs)
 * - HTTPS proxy via `HTTPS_PROXY` environment variable
 * - In-memory TTL caching via {@link TTLCache}
 */
export class RegistryFetcher {
  private baseUrl: string
  private agent: HttpsProxyAgent<string> | undefined
  private cache: TTLCache<unknown>

  constructor(options: RegistryFetcherOptions = {}) {
    this.baseUrl = options.registryUrl ?? 'https://ui.adrianub.dev/r'
    this.agent = process.env.HTTPS_PROXY
      ? new HttpsProxyAgent(process.env.HTTPS_PROXY)
      : undefined
    this.cache = new TTLCache(options.ttlMs)
  }

  /**
   * Fetches a JSON resource from the registry.
   *
   * @param path - Relative path (e.g. `index.json`) or absolute URL
   * @returns Parsed JSON response
   * @throws {FetchError} On network failure, non-OK HTTP status, or parse error
   */
  async fetchJson<T = unknown>(path: string): Promise<T> {
    const url = this.resolveUrl(path)

    // Check cache
    const cached = this.cache.get(url)
    if (cached !== undefined) {
      return cached as T
    }

    let response: Awaited<ReturnType<typeof fetch>>
    try {
      response = await fetch(url, { agent: this.agent })
    }
    catch (error) {
      throw new FetchError(
        `Failed to fetch ${url}: ${(error as Error).message}`,
        0,
      )
    }

    if (!response.ok) {
      throw new FetchError(
        `Failed to fetch ${url}: ${response.statusText}`,
        response.status,
      )
    }

    let data: T
    try {
      data = (await response.json()) as T
    }
    catch (error) {
      throw new FetchError(
        `Failed to parse response from ${url}: ${(error as Error).message}`,
        0,
      )
    }

    this.cache.set(url, data)
    return data
  }

  /**
   * Resolves a path to an absolute URL.
   * Absolute URLs (`http://...` or `https://...`) are passed through.
   * Relative paths are resolved against the base registry URL.
   */
  private resolveUrl(path: string): string {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path
    }
    // Strip leading slash to avoid double slashes
    const normalizedPath = path.startsWith('/') ? path.slice(1) : path
    return `${this.baseUrl}/${normalizedPath}`
  }
}
