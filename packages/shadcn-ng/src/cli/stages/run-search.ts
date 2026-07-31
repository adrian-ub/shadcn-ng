import type { RegistryIndex, RegistryItem } from '../../registry/schemas'

import type { SearchOptions, SearchResult } from '../schemas/search'

import fuzzysort from 'fuzzysort'

import { RegistryResolver } from '../../registry'
import { highlighter } from '../../utils/highlighter'
import { logger } from '../../utils/logger'
import { spinner } from '../../utils/spinner'

/**
 * Longest description rendered inline by {@link formatSearchResultDescription}.
 * Matches upstream shadcn-ui's search output width.
 */
export const SEARCH_RESULT_DESCRIPTION_MAX_LENGTH = 80

/**
 * Fuzzy-matches registry items against a query. The query is matched against
 * both the item name and its description; results are ranked by fuzzysort
 * score. An empty (or whitespace-only) query returns the index unchanged.
 */
export function searchIndex(index: RegistryIndex, query: string): RegistryIndex {
  const trimmed = query.trim()

  if (!trimmed) {
    return index
  }

  const results = fuzzysort.go(trimmed, index, {
    keys: ['name', 'description'],
    threshold: -10000,
    limit: index.length,
  })

  return results.map(result => result.obj)
}

/** Strips the `registry:` prefix from an item type for display. */
export function formatSearchResultType(type: string): string {
  return type.startsWith('registry:') ? type.slice('registry:'.length) : type
}

/**
 * Normalizes and truncates a component description for inline display,
 * keeping the ellipsis inside the maximum length.
 */
export function formatSearchResultDescription(
  description: string,
  maxLength: number = SEARCH_RESULT_DESCRIPTION_MAX_LENGTH,
): string {
  const normalized = description.trim().replace(/\s+/g, ' ')

  if (normalized.length <= maxLength) {
    return normalized
  }

  const truncated = normalized.slice(0, maxLength - 3).trimEnd()
  const lastSpace = truncated.lastIndexOf(' ')
  const base = lastSpace > maxLength * 0.6
    ? truncated.slice(0, lastSpace)
    : truncated

  return `${base.trimEnd()}...`
}

/** Renders one search result line: `- name (type) — description`. */
export function formatSearchItem(item: RegistryItem): string {
  const type = formatSearchResultType(item.type)
  const typeSuffix = type ? ` (${type})` : ''
  const descriptionSuffix = item.description
    ? ` — ${formatSearchResultDescription(item.description)}`
    : ''

  return `- ${highlighter.info(item.name)}${typeSuffix}${descriptionSuffix}`
}

/**
 * Fetches the registry index, fuzzy-matches it against the query, and prints
 * the ranked results. Returns the matched items for programmatic use.
 */
export async function runSearch(options: SearchOptions): Promise<SearchResult> {
  const resolver = new RegistryResolver()

  const registrySpinner = spinner('Searching registry.').start()
  const index = await resolver.getIndex()
  const items = searchIndex(index, options.query ?? '')
  registrySpinner.succeed(
    `Found ${items.length} matching ${items.length === 1 ? 'component' : 'components'
    }.`,
  )

  if (items.length === 0) {
    const scope = options.query
      ? ` matching ${highlighter.info(`"${options.query}"`)}`
      : ''
    logger.warn(`No components found${scope}.`)
    return { query: options.query, total: 0, items }
  }

  logger.log(items.map(formatSearchItem).join('\n'))

  return { query: options.query, total: items.length, items }
}
