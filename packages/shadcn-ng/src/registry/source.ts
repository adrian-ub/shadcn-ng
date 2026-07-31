import { FetchError } from './errors'

// ── Constants ───────────────────────────────────────────────────────────────

/** Environment variable that overrides the configured registry source. */
export const REGISTRY_URL_ENV_VAR = 'SHADCN_REGISTRY_URL'

/** Default registry base URL used when no source is configured. */
export const DEFAULT_REGISTRY_URL = 'https://ui.adrianub.dev/r'

const GITHUB_RAW_URL = 'https://raw.githubusercontent.com'
const DEFAULT_GITHUB_REF = 'main'

// ── Types ───────────────────────────────────────────────────────────────────

/**
 * GitHub registry source. Relative registry paths resolve against
 * `https://raw.githubusercontent.com/{owner}/{repo}/{ref}`.
 */
export interface GitHubRegistrySource {
  type: 'github'
  /** GitHub owner (user or organization). */
  owner: string
  /** Repository name. */
  repo: string
  /** Branch, tag, or commit SHA. Defaults to `main`. */
  ref: string
}

/**
 * Direct URL registry source. Relative registry paths resolve against the URL.
 */
export interface UrlRegistrySource {
  type: 'url'
  /** Base URL for the registry (e.g. `https://ui.example.com/r`). */
  url: string
}

/**
 * A registry source maps registry-relative paths (e.g. `index.json`) to
 * absolute fetch URLs.
 */
export type RegistrySource = GitHubRegistrySource | UrlRegistrySource

// ── Parsing ─────────────────────────────────────────────────────────────────

/**
 * Parses a configured registry source value.
 *
 * Supported forms:
 * - GitHub shorthand: `github.com/owner/repo`, `github.com/owner/repo/ref`,
 *   `github.com/owner/repo@ref`, and full `https://github.com/...` URLs
 * - Direct URL: any `http(s)://` URL
 *
 * @throws {FetchError} When the value is empty or neither a GitHub source
 *   nor a valid HTTP(S) URL. The message is actionable so users can fix
 *   their `registry-url` config.
 */
export function parseRegistrySource(input: string): RegistrySource {
  const value = input.trim()

  if (!value) {
    throw new FetchError(
      `Invalid registry URL: "${input}" is empty. Configure a registry URL like "https://ui.example.com/r" or a GitHub source like "github.com/owner/repo".`,
    )
  }

  // github.com/{owner}/{repo}[/{ref}][@{ref}]
  const githubMatch = value.match(
    /^(?:https?:\/\/)?github\.com\/([^/\s@]+)\/([^/\s@]+)(?:\/([^\s@/]+))?(?:@([^\s/]+))?$/,
  )
  if (githubMatch) {
    const [, owner, repo, pathRef, tagRef] = githubMatch
    return {
      type: 'github',
      owner,
      repo,
      ref: tagRef ?? pathRef ?? DEFAULT_GITHUB_REF,
    }
  }

  if (isValidHttpUrl(value)) {
    return { type: 'url', url: value }
  }

  throw new FetchError(
    `Invalid registry URL: "${input}". Expected a URL like "https://ui.example.com/r" or a GitHub source like "github.com/owner/repo" or "github.com/owner/repo/main".`,
  )
}

/**
 * Resolves the effective registry source for a fetch.
 *
 * Precedence: `SHADCN_REGISTRY_URL` environment variable wins over any
 * configured source; otherwise the provided source is used; otherwise the
 * default registry URL applies.
 */
export function resolveRegistrySource(
  source?: RegistrySource | string,
): RegistrySource {
  const envUrl = process.env[REGISTRY_URL_ENV_VAR]
  if (envUrl) {
    return parseRegistrySource(envUrl)
  }

  if (typeof source === 'string') {
    return parseRegistrySource(source)
  }

  if (source) {
    return source
  }

  return { type: 'url', url: DEFAULT_REGISTRY_URL }
}

/**
 * Maps a {@link RegistrySource} to the base URL that relative registry
 * paths resolve against.
 */
export function getRegistryBaseUrl(source: RegistrySource): string {
  if (source.type === 'github') {
    return `${GITHUB_RAW_URL}/${source.owner}/${source.repo}/${source.ref}`
  }

  return source.url.replace(/\/+$/, '')
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  }
  catch {
    return false
  }
}
