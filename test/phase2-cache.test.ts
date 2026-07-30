import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { TTLCache } from '../src/registry/cache'

// ── P2.T3a: TTLCache ───────────────────────────────────────────────────────

describe('P2.T3a: TTLCache', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('get / set', () => {
    it('returns undefined for a missing key', () => {
      const cache = new TTLCache<string>()
      expect(cache.get('nonexistent')).toBeUndefined()
    })

    it('returns the stored value for an existing key', () => {
      const cache = new TTLCache<string>()
      cache.set('foo', 'bar')
      expect(cache.get('foo')).toBe('bar')
    })

    it('stores and retrieves an object value', () => {
      const cache = new TTLCache<{ name: string }>()
      const obj = { name: 'button' }
      cache.set('item', obj)
      expect(cache.get('item')).toEqual({ name: 'button' })
    })

    it('returns undefined after a value expires', () => {
      const cache = new TTLCache<string>(100) // 100ms TTL
      cache.set('foo', 'bar')
      vi.advanceTimersByTime(101)
      expect(cache.get('foo')).toBeUndefined()
    })

    it('respects a custom TTL per set() call', () => {
      const cache = new TTLCache<string>(5000) // default 5s
      cache.set('foo', 'bar', 200) // custom 200ms
      vi.advanceTimersByTime(201)
      expect(cache.get('foo')).toBeUndefined()
    })

    it('still returns value before custom TTL expires', () => {
      const cache = new TTLCache<string>(5000)
      cache.set('foo', 'bar', 200)
      vi.advanceTimersByTime(199)
      expect(cache.get('foo')).toBe('bar')
    })

    it('does not expire when advanced just under default TTL', () => {
      const cache = new TTLCache<string>(100)
      cache.set('foo', 'bar')
      vi.advanceTimersByTime(99)
      expect(cache.get('foo')).toBe('bar')
    })

    it('supports undefined as a stored value', () => {
      const cache = new TTLCache<undefined>()
      cache.set('nullval', undefined as unknown as undefined)
      expect(cache.get('nullval')).toBeUndefined()
    })
  })

  describe('has', () => {
    it('returns false for a missing key', () => {
      const cache = new TTLCache<string>()
      expect(cache.has('missing')).toBe(false)
    })

    it('returns true for an existing key', () => {
      const cache = new TTLCache<string>()
      cache.set('foo', 'bar')
      expect(cache.has('foo')).toBe(true)
    })

    it('returns false after a value expires', () => {
      const cache = new TTLCache<string>(100)
      cache.set('foo', 'bar')
      vi.advanceTimersByTime(101)
      expect(cache.has('foo')).toBe(false)
    })
  })

  describe('clear', () => {
    it('removes all entries from the cache', () => {
      const cache = new TTLCache<string>()
      cache.set('a', '1')
      cache.set('b', '2')
      cache.clear()
      expect(cache.has('a')).toBe(false)
      expect(cache.has('b')).toBe(false)
    })

    it('leaves cache empty after clear', () => {
      const cache = new TTLCache<string>()
      cache.set('k', 'v')
      cache.clear()
      expect(cache.get('k')).toBeUndefined()
    })
  })

  describe('default TTL', () => {
    it('uses 5 minutes as the default TTL when not specified', () => {
      const cache = new TTLCache<string>()
      cache.set('foo', 'bar')
      // 4:59 minutes — still valid
      vi.advanceTimersByTime(4 * 60 * 1000 + 59 * 1000)
      expect(cache.get('foo')).toBe('bar')
      // 5:01 minutes — expired
      vi.advanceTimersByTime(2000)
      expect(cache.get('foo')).toBeUndefined()
    })
  })
})
