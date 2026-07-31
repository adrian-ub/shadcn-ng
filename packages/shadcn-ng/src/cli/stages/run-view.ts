import type { SourceFile, ViewOptions, ViewResult } from '../schemas/view'

import { RegistryResolver } from '../../registry'
import { DepNotFoundError } from '../../registry/errors'
import { logger } from '../../utils/logger'
import { spinner } from '../../utils/spinner'

/** Renders one source file as a header line followed by its raw content. */
export function renderSourceFile(file: SourceFile): string {
  return `=== ${file.path} ===\n${file.content ?? ''}`
}

/**
 * Resolves a single registry component and prints the raw source content of
 * each of its files. Returns the displayed files for programmatic use.
 */
export async function runView(options: ViewOptions): Promise<ViewResult> {
  const resolver = new RegistryResolver()

  const registrySpinner = spinner(
    `Resolving component "${options.component}" from registry.`,
  ).start()
  const tree = await resolver.resolve([options.component])
  const item = tree.items.find(entry => entry.name === options.component)
  registrySpinner.succeed(`Resolved component "${options.component}".`)

  if (!item) {
    throw new DepNotFoundError(options.component)
  }

  const files: SourceFile[] = (item.files ?? []).map(file => ({
    path: file.path,
    content: file.content,
  }))

  if (files.length === 0) {
    logger.warn(
      `Component "${options.component}" has no source files.`,
    )
    return { component: options.component, files }
  }

  for (const file of files) {
    logger.log(renderSourceFile(file))
  }

  return { component: options.component, files }
}
