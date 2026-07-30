import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { RegistryFetcher } from '../src/registry/fetcher'
import { FetchError } from '../src/registry/errors'

// ── P2.T3b: RegistryFetcher ─────────────────────────────────────────────────

const mockJson = vi.fn()
const mockFetch = vi.fn()

vi.mock('node-fetch', () => ({
  default: (...args: unknown[]) => mockFetch(...args),
}))

// We'll mock https-proxy-agent indirectly — we test that it's
// constructed when HTTPS_PROXY is set by checking the agent passthrough.

describe('P2.T3b: RegistryFetcher', () => {
  let fetcher: RegistryFetcher

  beforeEach(() => {
    vi.clearAllMocks()
    delete process.env.HTTPS_PROXY
    fetcher = new RegistryFetcher({ registryUrl: 'https://r.example.com/r' })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchJson', () => {
    it('fetches and returns parsed JSON from a relative path', async () => {
      const data = { name: 'button', type: 'registry:ui' }
      mockJson.mockResolvedValue(data)
      mockFetch.mockResolvedValue({
        ok: true,
        json: mockJson,
      })

      const result = await fetcher.fetchJson('index.json')
      expect(result).toEqual(data)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://r.example.com/r/index.json',
        expect.objectContaining({ agent: undefined }),
      )
    })

    it('fetches and returns parsed JSON from an absolute URL', async () => {
      const data = { name: 'button' }
      mockJson.mockResolvedValue(data)
      mockFetch.mockResolvedValue({ ok: true, json: mockJson })

      const result = await fetcher.fetchJson('https://raw.github.com/user/repo/index.json')
      expect(result).toEqual(data)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://raw.github.com/user/repo/index.json',
        expect.any(Object),
      )
    })

    it('throws FetchError on non-OK response', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      })

      await expect(fetcher.fetchJson('missing.json')).rejects.toThrow(FetchError)
    })

    it('includes the status code in FetchError', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      })

      try {
        await fetcher.fetchJson('missing.json')
        expect.unreachable('Should have thrown')
      }
      catch (error) {
        expect(error).toBeInstanceOf(FetchError)
        if (error instanceof FetchError) {
          expect(error.statusCode).toBe(404)
        }
      }
    })

    it('throws FetchError with statusCode 0 on network failure', async () => {
      mockFetch.mockRejectedValue(new Error('ECONNREFUSED'))

      try {
        await fetcher.fetchJson('index.json')
        expect.unreachable('Should have thrown')
      }
      catch (error) {
        expect(error).toBeInstanceOf(FetchError)
        if (error instanceof FetchError) {
          expect(error.statusCode).toBe(0)
          expect(error.message).toContain('index.json')
        }
      }
    })

    it('throws FetchError with statusCode 0 when JSON parsing fails', async () => {
      mockJson.mockRejectedValue(new Error('Unexpected token'))
      mockFetch.mockResolvedValue({
        ok: true,
        json: mockJson,
      })

      try {
        await fetcher.fetchJson('index.json')
        expect.unreachable('Should have thrown')
      }
      catch (error) {
        expect(error).toBeInstanceOf(FetchError)
        if (error instanceof FetchError) {
          expect(error.statusCode).toBe(0)
          expect(error.message).toContain('index.json')
        }
      }
    })

    it('caches the result and does not fetch again for the same URL', async () => {
      const data = { name: 'button' }
      mockJson.mockResolvedValue(data)
      mockFetch.mockResolvedValue({ ok: true, json: mockJson })

      // First call
      const result1 = await fetcher.fetchJson('index.json')
      expect(result1).toEqual(data)
      expect(mockFetch).toHaveBeenCalledTimes(1)

      // Second call — should use cache
      const result2 = await fetcher.fetchJson('index.json')
      expect(result2).toEqual(data)
      expect(mockFetch).toHaveBeenCalledTimes(1) // Not incremented
    })

    it('respects cache expiry and re-fetches after TTL', async () => {
      vi.useFakeTimers()
      const data = { name: 'button' }
      mockJson.mockResolvedValue(data)
      mockFetch.mockResolvedValue({ ok: true, json: mockJson })

      // Short TTL fetcher for this test
      const shortFetcher = new RegistryFetcher({
        registryUrl: 'https://r.example.com/r',
        ttlMs: 100,
      })

      // First call
      await shortFetcher.fetchJson('index.json')
      expect(mockFetch).toHaveBeenCalledTimes(1)

      // Advance beyond TTL
      vi.advanceTimersByTime(101)

      // Second call — should re-fetch
      await shortFetcher.fetchJson('index.json')
      expect(mockFetch).toHaveBeenCalledTimes(2)

      vi.useRealTimers()
    })
  })

  describe('constructor', () => {
    it('uses the provided registryUrl', () => {
      const f = new RegistryFetcher({ registryUrl: 'https://custom.dev/r' })
      // Test by fetching a relative path
      mockFetch.mockResolvedValue({ ok: true, json: mockJson })
      mockJson.mockResolvedValue({})
      f.fetchJson('index.json')
      expect(mockFetch).toHaveBeenCalledWith(
        'https://custom.dev/r/index.json',
        expect.any(Object),
      )
    })

    it('defaults registryUrl when not provided', () => {
      const f = new RegistryFetcher()
      expect(f).toBeInstanceOf(RegistryFetcher)
    })

    it('passes HttpsProxyAgent when HTTPS_PROXY is set', async () => {
      process.env.HTTPS_PROXY = 'http://proxy:8080'
      const proxiedFetcher = new RegistryFetcher({
        registryUrl: 'https://r.example.com/r',
      })

      mockJson.mockResolvedValue({})
      mockFetch.mockResolvedValue({ ok: true, json: mockJson })

      await proxiedFetcher.fetchJson('index.json')

      // The fetch call should include an agent (HttpsProxyAgent)
      const callArgs = mockFetch.mock.calls[0]
      const options = callArgs[1] as { agent?: object }
      expect(options.agent).toBeDefined()
    })
  })
})
