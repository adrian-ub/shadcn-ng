// ── TTL Cache ───────────────────────────────────────────────────────────────

interface CacheEntry<T> {
  value: T
  expiresAt: number
}

/**
 * In-memory TTL cache with auto-expiry on read.
 *
 * Entries are lazily evicted — expired entries are removed when
 * accessed via `get()` or `has()`, not by a background timer.
 */
export class TTLCache<T = unknown> {
  private store: Map<string, CacheEntry<T>>
  private defaultTTLMs: number

  /**
   * @param defaultTTLMs Default time-to-live in milliseconds (default: 5 minutes)
   */
  constructor(defaultTTLMs: number = 5 * 60 * 1000) {
    this.store = new Map()
    this.defaultTTLMs = defaultTTLMs
  }

  /**
   * Returns the value for `key`, or `undefined` if missing or expired.
   * Expired entries are automatically deleted.
   */
  get(key: string): T | undefined {
    const entry = this.store.get(key)
    if (!entry) {
      return undefined
    }

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return undefined
    }

    return entry.value
  }

  /**
   * Stores `value` for `key` with an optional TTL.
   * @param ttl TTL in milliseconds (defaults to the cache-wide defaultTTLMs)
   */
  set(key: string, value: T, ttl?: number): void {
    const ttlMs = ttl ?? this.defaultTTLMs
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    })
  }

  /**
   * Returns `true` if `key` exists and has not expired.
   * Expired entries are automatically deleted.
   */
  has(key: string): boolean {
    const entry = this.store.get(key)
    if (!entry) {
      return false
    }

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return false
    }

    return true
  }

  /**
   * Removes all entries from the cache.
   */
  clear(): void {
    this.store.clear()
  }
}
