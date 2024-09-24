import path from 'node:path'
import process from 'node:process'

import { HttpsProxyAgent } from 'https-proxy-agent'
import fetch from 'node-fetch'
import type { z } from 'zod'

import {
  registryBaseColorSchema,
  registryIndexSchema,
  registryWithContentSchema,
  stylesSchema,
} from '../registry/schema'
import type { Config } from '../get-config'
import type {
  registryItemWithContentSchema,
} from '../registry/schema'

const baseUrl
  = process.env.COMPONENTS_REGISTRY_URL ?? 'https://ui.adrianub.dev'
const agent = process.env.https_proxy
  ? new HttpsProxyAgent(process.env.https_proxy)
  : undefined

export async function getRegistryIndex(): Promise<{ name: string, type: 'components:ui' | 'components:component' | 'components:example', files: string[], dependencies?: string[] | undefined, devDependencies?: string[] | undefined, registryDependencies?: string[] | undefined }[]> {
  try {
    const [result] = await fetchRegistry(['index.json'])

    return registryIndexSchema.parse(result)
  }
  catch {
    throw new Error(`Failed to fetch components from registry.`)
  }
}

export async function getRegistryStyles(): Promise<{ name: string, label: string }[]> {
  try {
    const [result] = await fetchRegistry(['styles/index.json'])

    return stylesSchema.parse(result)
  }
  catch {
    throw new Error(`Failed to fetch styles from registry.`)
  }
}

export async function getRegistryBaseColors(): Promise<{ name: string, label: string }[]> {
  return [
    {
      name: 'slate',
      label: 'Slate',
    },
    {
      name: 'gray',
      label: 'Gray',
    },
    {
      name: 'zinc',
      label: 'Zinc',
    },
    {
      name: 'neutral',
      label: 'Neutral',
    },
    {
      name: 'stone',
      label: 'Stone',
    },
  ]
}

export async function getRegistryBaseColor(baseColor: string): Promise<{ inlineColors: { light: Record<string, string>, dark: Record<string, string> }, cssVars: { light: Record<string, string>, dark: Record<string, string> }, inlineColorsTemplate: string, cssVarsTemplate: string }> {
  try {
    const [result] = await fetchRegistry([`colors/${baseColor}.json`])

    return registryBaseColorSchema.parse(result)
  }
  catch {
    throw new Error(`Failed to fetch base color from registry.`)
  }
}

export async function resolveTree(
  index: z.infer<typeof registryIndexSchema>,
  names: string[],
): Promise<{ type: 'components:ui' | 'components:component' | 'components:example', name: string, files: string[], dependencies?: string[] | undefined, devDependencies?: string[] | undefined, registryDependencies?: string[] | undefined }[]> {
  const tree: z.infer<typeof registryIndexSchema> = []

  for (const name of names) {
    const entry = index.find(entry => entry.name === name)

    if (!entry) {
      continue
    }

    tree.push(entry)

    if (entry.registryDependencies) {
      const dependencies = await resolveTree(index, entry.registryDependencies)
      tree.push(...dependencies)
    }
  }

  return tree.filter(
    (component, index, self) =>
      self.findIndex(c => c.name === component.name) === index,
  )
}

export async function fetchTree(
  style: string,
  tree: z.infer<typeof registryIndexSchema>,
): Promise<{ type: 'components:ui' | 'components:component' | 'components:example', name: string, files: { name: string, content: string }[], dependencies?: string[] | undefined, devDependencies?: string[] | undefined, registryDependencies?: string[] | undefined }[]> {
  try {
    const paths = tree.map(item => `styles/${style}/${item.name}.json`)
    const result = await fetchRegistry(paths)

    return registryWithContentSchema.parse(result)
  }
  catch {
    throw new Error(`Failed to fetch tree from registry.`)
  }
}

export async function getItemTargetPath(
  config: Config,
  item: Pick<z.infer<typeof registryItemWithContentSchema>, 'type'>,
  override?: string,
): Promise<string | null> {
  if (override) {
    return override
  }

  if (item.type === 'components:ui' && config.aliases.ui) {
    return config.resolvedPaths.ui
  }

  const [parent, type] = item.type.split(':')
  if (!(parent in config.resolvedPaths)) {
    return null
  }

  return path.join(
    config.resolvedPaths[parent as keyof typeof config.resolvedPaths],
    type,
  )
}

async function fetchRegistry(paths: string[]): Promise<unknown[]> {
  try {
    const results = await Promise.all(
      paths.map(async (path) => {
        const response = await fetch(`${baseUrl}/registry/${path}`, {
          agent,
        })
        return await response.json()
      }),
    )

    return results
  }
  catch {
    throw new Error(`Failed to fetch registry from ${baseUrl}.`)
  }
}
