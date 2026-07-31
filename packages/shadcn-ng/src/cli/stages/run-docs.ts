import type { RegistryIndex } from '../../registry/schemas'

import type { DocsOptions, DocsResult } from '../schemas/docs'

import { spawn } from 'node:child_process'

import process from 'node:process'
import { RegistryResolver } from '../../registry'
import { DepNotFoundError } from '../../registry/errors'
import { highlighter } from '../../utils/highlighter'
import { logger } from '../../utils/logger'
import { spinner } from '../../utils/spinner'

export async function runDocs(options: DocsOptions): Promise<DocsResult> {
  const resolver = new RegistryResolver()

  const registrySpinner = spinner('Resolving components from registry.').start()
  const index = await resolver.getIndex()
  registrySpinner.succeed(
    `Resolved ${options.components.length} ${options.components.length === 1 ? 'component' : 'components'
    } from registry.`,
  )

  const urls = options.components.map(component =>
    resolveDocsUrl(index, component),
  )

  for (const url of urls) {
    openUrl(url)
  }

  return {
    components: options.components,
    urls,
  }
}

export function resolveDocsUrl(index: RegistryIndex, component: string): string {
  const item = index.find(entry => entry.name === component)

  if (!item) {
    throw new DepNotFoundError(component)
  }

  if (!item.docs) {
    throw new Error(
      `No documentation link available for ${highlighter.info(component)}.`,
    )
  }

  return item.docs
}

export function getOpenCommand(platform: NodeJS.Platform): {
  command: string
  args: string[]
} {
  switch (platform) {
    case 'darwin':
      return { command: 'open', args: [] }
    case 'win32':
      return { command: 'cmd', args: ['/c', 'start', ''] }
    default:
      return { command: 'xdg-open', args: [] }
  }
}

export function openUrl(url: string): void {
  const { command, args } = getOpenCommand(process.platform)
  const child = spawn(command, [...args, url], {
    detached: true,
    stdio: 'ignore',
  })
  // Swallow opener failures (e.g. headless environments) — the URL below is
  // still printed so the command remains useful without a browser.
  child.on('error', () => {})
  child.unref()

  logger.info(`Opening docs: ${highlighter.info(url)}`)
}
