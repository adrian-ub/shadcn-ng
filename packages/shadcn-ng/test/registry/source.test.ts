import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  DEFAULT_REGISTRY_URL,
  REGISTRY_URL_ENV_VAR,
  getRegistryBaseUrl,
  parseRegistrySource,
  resolveRegistrySource,
} from '../../src/registry/source'
import { FetchError } from '../../src/registry/errors'

// ── P2.T4a: Multi-source registry resolution ────────────────────────────────

describe('P2.T4a: parseRegistrySource', () => {
  it('parses a GitHub shorthand with an explicit ref path (registry-url scenario)', () => {
    expect(parseRegistrySource('github.com/user/repo/tags')).toEqual({
      type: 'github',
      owner: 'user',
      repo: 'repo',
      ref: 'tags',
    })
  })

  it('parses a GitHub shorthand with an @ref', () => {
    expect(parseRegistrySource('github.com/acme/ui@v1.2.3')).toEqual({
      type: 'github',
      owner: 'acme',
      repo: 'ui',
      ref: 'v1.2.3',
    })
  })

  it('defaults the GitHub ref to main when omitted', () => {
    expect(parseRegistrySource('github.com/acme/ui')).toEqual({
      type: 'github',
      owner: 'acme',
      repo: 'ui',
      ref: 'main',
    })
  })

  it('accepts a full https://github.com URL and normalizes it', () => {
    expect(parseRegistrySource('https://github.com/acme/ui/main')).toEqual({
      type: 'github',
      owner: 'acme',
      repo: 'ui',
      ref: 'main',
    })
  })

  it('passes through a direct registry URL', () => {
    expect(parseRegistrySource('https://ui.example.com/r')).toEqual({
      type: 'url',
      url: 'https://ui.example.com/r',
    })
  })

  it('throws FetchError with an actionable message for malformed input', () => {
    expect(() => parseRegistrySource('not a registry')).toThrow(FetchError)
    expect(() => parseRegistrySource('not a registry')).toThrow(
      /Invalid registry URL/,
    )
  })

  it('throws FetchError for empty input', () => {
    expect(() => parseRegistrySource('')).toThrow(FetchError)
    expect(() => parseRegistrySource('')).toThrow(/Invalid registry URL/)
  })

  it('rejects non-http schemes like ftp://', () => {
    expect(() => parseRegistrySource('ftp://registry.example.com/r')).toThrow(
      FetchError,
    )
  })
})

describe('P2.T4a: resolveRegistrySource (ENV override)', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('lets SHADCN_REGISTRY_URL override a config source', () => {
    vi.stubEnv(REGISTRY_URL_ENV_VAR, 'https://env.example.com/r')
    const source = resolveRegistrySource('https://config.example.com/r')
    expect(source).toEqual({
      type: 'url',
      url: 'https://env.example.com/r',
    })
  })

  it('lets SHADCN_REGISTRY_URL override an explicit RegistrySource object', () => {
    vi.stubEnv(REGISTRY_URL_ENV_VAR, 'github.com/env/registry/main')
    const source = resolveRegistrySource({
      type: 'url',
      url: 'https://config.example.com/r',
    })
    expect(source).toEqual({
      type: 'github',
      owner: 'env',
      repo: 'registry',
      ref: 'main',
    })
  })

  it('parses a string source when no env override is set', () => {
    expect(resolveRegistrySource('github.com/user/repo/tags')).toEqual({
      type: 'github',
      owner: 'user',
      repo: 'repo',
      ref: 'tags',
    })
  })

  it('returns a RegistrySource object unchanged when no env override is set', () => {
    const source = { type: 'url' as const, url: 'https://r.example.com/r' }
    expect(resolveRegistrySource(source)).toBe(source)
  })

  it('falls back to the default registry URL when nothing is provided', () => {
    expect(resolveRegistrySource()).toEqual({
      type: 'url',
      url: DEFAULT_REGISTRY_URL,
    })
  })

  it('exposes the expected environment variable name', () => {
    expect(REGISTRY_URL_ENV_VAR).toBe('SHADCN_REGISTRY_URL')
  })
})

describe('P2.T4a: getRegistryBaseUrl', () => {
  it('maps a GitHub source to raw.githubusercontent.com', () => {
    expect(
      getRegistryBaseUrl({
        type: 'github',
        owner: 'user',
        repo: 'repo',
        ref: 'tags',
      }),
    ).toBe('https://raw.githubusercontent.com/user/repo/tags')
  })

  it('maps a URL source to itself', () => {
    expect(getRegistryBaseUrl({ type: 'url', url: 'https://ui.example.com/r' }))
      .toBe('https://ui.example.com/r')
  })

  it('strips trailing slashes from a URL source', () => {
    expect(getRegistryBaseUrl({ type: 'url', url: 'https://ui.example.com/r/' }))
      .toBe('https://ui.example.com/r')
  })
})
