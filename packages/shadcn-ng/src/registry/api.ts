import type { Config } from './schema'
import path from 'node:path'

import process from 'node:process'
import { logger } from '../utils/logger'
import deepmerge from 'deepmerge'
import { HttpsProxyAgent } from 'https-proxy-agent'
import fetch from 'node-fetch'
import { z } from 'zod'

import { getTargetStyleFromConfig } from '../cli/stages/get-config'
import { getProjectTailwindVersionFromConfig } from '../cli/stages/get-project-info'
import { handleError } from '../utils/handle-error'
import { buildTailwindThemeColorsFromCssVars } from '../utils/updaters/update-tailwind-config'
import { IconsSchema, RegistryBaseColorSchema, RegistryIndexSchema, RegistryItemSchema, RegistryResolvedItemsTreeSchema, StylesSchema } from './schema'

const agent = process.env.https_proxy
  ? new HttpsProxyAgent(process.env.https_proxy)
  : undefined

const registryCache = new Map<string, Promise<any>>()

function isUrl(path: string): boolean {
  try {
    // eslint-disable-next-line no-new
    new URL(path)
    return true
  }
  catch {
    return false
  }
}

function getRegistryUrl(urlRegistry: string, path: string): string {
  if (isUrl(path)) {
    const url = new URL(path)
    return url.toString()
  }

  return `${urlRegistry}/${path}`
}

async function fetchRegistry(urlRegistry: string, paths: string[]): Promise<unknown[]> {
  try {
    const results = await Promise.all(
      paths.map(async (path) => {
        const url = getRegistryUrl(urlRegistry, path)
        // Check cache first
        if (registryCache.has(url)) {
          return registryCache.get(url)
        }
        // Store the promise in the cache before awaiting
        const fetchPromise = (async () => {
          const response = await fetch(url, { agent })

          if (!response.ok) {
            const errorMessages: { [key: number]: string } = {
              400: 'Bad request',
              401: 'Unauthorized',
              403: 'Forbidden',
              404: 'Not found',
              500: 'Internal server error',
            }

            if (response.status === 401) {
              throw new Error(
                `You are not authorized to access the component at ${logger.info(
                  url,
                )}.\nIf this is a remote registry, you may need to authenticate.`,
              )
            }

            if (response.status === 404) {
              throw new Error(
                `The component at ${logger.info(
                  url,
                )} was not found.\nIt may not exist at the registry. Please make sure it is a valid component.`,
              )
            }

            if (response.status === 403) {
              throw new Error(
                `You do not have access to the component at ${logger.info(
                  url,
                )}.\nIf this is a remote registry, you may need to authenticate or a token.`,
              )
            }

            const result = await response.json()
            const message
              = result && typeof result === 'object' && 'error' in result
                ? result.error
                : response.statusText || errorMessages[response.status]

            throw new Error(
              `Failed to fetch from ${url}.\n${message}`,
            )
          }

          return response.json()
        })()

        registryCache.set(url, fetchPromise)
        return fetchPromise
      }),
    )

    return results
  }
  catch (error) {
    handleError(error)
    return []
  }
}

async function getRegistryIndex(urlRegistry: string): Promise<z.infer<typeof RegistryIndexSchema> | undefined> {
  try {
    const [result] = await fetchRegistry(urlRegistry, ['index.json'])

    return RegistryIndexSchema.parse(result)
  }
  catch (error) {
    handleError(error)
  }
}

async function getRegistryStyles(urlRegistry: string): Promise<z.infer<typeof StylesSchema>> {
  try {
    const [result] = await fetchRegistry(urlRegistry, ['styles/index.json'])
    return StylesSchema.parse(result)
  }
  catch (error) {
    handleError(error)
    return []
  }
}

async function getRegistryIcons(urlRegistry: string): Promise<z.infer<typeof IconsSchema>> {
  try {
    const [result] = await fetchRegistry(urlRegistry, ['icons/index.json'])
    return IconsSchema.parse(result)
  }
  catch (error) {
    handleError(error)
    return {}
  }
}

async function getRegistryItem(urlRegistry: string, name: string, style: string): Promise<z.infer<typeof RegistryItemSchema> | null> {
  try {
    const [result] = await fetchRegistry(urlRegistry, [
      isUrl(name) ? name : `styles/${style}/${name}.json`,
    ])

    return RegistryItemSchema.parse(result)
  }
  catch (error) {
    handleError(error)
    return null
  }
}

async function getRegistryBaseColor(urlRegistry: string, baseColor: string): Promise<z.infer<typeof RegistryBaseColorSchema> | undefined> {
  try {
    const [result] = await fetchRegistry(urlRegistry, [`colors/${baseColor}.json`])

    return RegistryBaseColorSchema.parse(result)
  }
  catch (error) {
    handleError(error)
  }
}

async function fetchTree(
  urlRegistry: string,
  style: string,
  tree: z.infer<typeof RegistryIndexSchema>,
): Promise<z.infer<typeof RegistryIndexSchema> | undefined> {
  try {
    const paths = tree.map(item => `styles/${style}/${item.name}.json`)
    const result = await fetchRegistry(urlRegistry, paths)
    return RegistryIndexSchema.parse(result)
  }
  catch (error) {
    handleError(error)
  }
}

async function getRegistryBaseColors(): Promise<{ name: string, label: string }[]> {
  return [
    {
      name: 'neutral',
      label: 'Neutral',
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
      name: 'stone',
      label: 'Stone',
    },
    {
      name: 'slate',
      label: 'Slate',
    },
  ]
}

async function resolveTree(
  index: z.infer<typeof RegistryIndexSchema>,
  names: string[],
): Promise<z.infer<typeof RegistryIndexSchema>> {
  const tree: z.infer<typeof RegistryIndexSchema> = []

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

async function getItemTargetPath(
  config: Config,
  item: Pick<z.infer<typeof RegistryItemSchema>, 'type'>,
  override?: string,
): Promise<string | null> {
  if (override) {
    return override
  }

  if (item.type === 'registry:ui') {
    return config.resolvedPaths.ui ?? config.resolvedPaths.components
  }

  const [parent, type] = item.type?.split(':') ?? []
  if (!(parent in config.resolvedPaths)) {
    return null
  }

  return path.join(
    config.resolvedPaths[parent as keyof typeof config.resolvedPaths],
    type,
  )
}

async function registryResolveItemsTree(
  urlRegistry: string,
  names: z.infer<typeof RegistryItemSchema>['name'][],
  config: Config,
): Promise<z.infer<typeof RegistryResolvedItemsTreeSchema> | null> {
  try {
    const index = await getRegistryIndex(urlRegistry)
    if (!index) {
      return null
    }

    // If we're resolving the index, we want it to go first.
    if (names.includes('index')) {
      names.unshift('index')
    }

    const registryItems = await resolveRegistryItems(urlRegistry, names, config)
    const result = await fetchRegistry(urlRegistry, registryItems)
    const payload = z.array(RegistryItemSchema).parse(result)

    if (!payload) {
      return null
    }

    // If we're resolving the index, we want to fetch
    // the theme item if a base color is provided.
    // We do this for index only.
    // Other components will ship with their theme tokens.
    if (names.includes('index')) {
      if (config.tailwind.baseColor) {
        const theme = await registryGetTheme(urlRegistry, config.tailwind.baseColor, config)
        if (theme) {
          payload.unshift(theme)
        }
      }
    }

    let tailwind = {}
    payload.forEach((item) => {
      tailwind = deepmerge(tailwind, item.tailwind ?? {})
    })

    let cssVars = {}
    payload.forEach((item) => {
      cssVars = deepmerge(cssVars, item.cssVars ?? {})
    })

    let docs = ''
    payload.forEach((item) => {
      if (item.docs) {
        docs += `${item.docs}\n`
      }
    })

    return RegistryResolvedItemsTreeSchema.parse({
      dependencies: deepmerge.all(
        payload.map(item => item.dependencies ?? []),
      ),
      devDependencies: deepmerge.all(
        payload.map(item => item.devDependencies ?? []),
      ),
      files: deepmerge.all(payload.map(item => item.files ?? [])),
      tailwind,
      cssVars,
      docs,
    })
  }
  catch (error) {
    handleError(error)
    return null
  }
}

async function resolveRegistryDependencies(
  urlRegistry: string,
  url: string,
  config: Config,
): Promise<string[]> {
  const visited = new Set<string>()
  const payload: string[] = []

  const style = config.resolvedPaths?.cwd
    ? await getTargetStyleFromConfig(config.resolvedPaths.cwd, config.style)
    : config.style

  async function resolveDependencies(itemUrl: string): Promise<void> {
    const url = getRegistryUrl(
      urlRegistry,
      isUrl(itemUrl) ? itemUrl : `styles/${style}/${itemUrl}.json`,
    )

    if (visited.has(url)) {
      return
    }

    visited.add(url)

    try {
      const [result] = await fetchRegistry(urlRegistry, [url])
      const item = RegistryItemSchema.parse(result)
      payload.push(url)

      if (item.registryDependencies) {
        for (const dependency of item.registryDependencies) {
          await resolveDependencies(dependency)
        }
      }
    }
    catch (error) {
      console.error(
        `Error fetching or parsing registry item at ${itemUrl}:`,
        error,
      )
    }
  }

  await resolveDependencies(url)
  return Array.from(new Set(payload))
}

async function registryGetTheme(urlRegistry: string, name: string, config: Config): Promise<z.infer<typeof RegistryItemSchema> | null> {
  const [baseColor, tailwindVersion] = await Promise.all([
    getRegistryBaseColor(urlRegistry, name),
    getProjectTailwindVersionFromConfig(config),
  ])
  if (!baseColor) {
    return null
  }

  const theme = {
    name,
    type: 'registry:theme',
    tailwind: {
      config: {
        theme: {
          extend: {
            borderRadius: {
              lg: 'var(--radius)',
              md: 'calc(var(--radius) - 2px)',
              sm: 'calc(var(--radius) - 4px)',
            },
            colors: {},
          },
        },
      },
    },
    cssVars: {
      light: {
        radius: '0.5rem',
      },
      dark: {},
    },
  } satisfies z.infer<typeof RegistryItemSchema>

  if (config.tailwind.cssVariables) {
    theme.tailwind.config.theme.extend.colors = {
      ...theme.tailwind.config.theme.extend.colors,
      ...buildTailwindThemeColorsFromCssVars(baseColor.cssVars.dark),
    }
    theme.cssVars = {
      light: {
        ...baseColor.cssVars.light,
        ...theme.cssVars.light,
      },
      dark: {
        ...baseColor.cssVars.dark,
        ...theme.cssVars.dark,
      },
    }
  }

  // Update theme to be v4 compatible.
  if (tailwindVersion === 'v4' && baseColor.cssVarsV4) {
    theme.cssVars = {
      light: {
        ...theme.cssVars.light,
        ...baseColor.cssVarsV4.light,
      },
      dark: {
        ...theme.cssVars.dark,
        ...baseColor.cssVarsV4.dark,
      },
    }
  }

  return theme
}

async function resolveRegistryItems(urlRegistry: string, names: string[], config: Config): Promise<string[]> {
  const registryDependencies: string[] = []
  for (const name of names) {
    const itemRegistryDependencies = await resolveRegistryDependencies(
      urlRegistry,
      name,
      config,
    )
    registryDependencies.push(...itemRegistryDependencies)
  }

  return Array.from(new Set(registryDependencies))
}

function getRegistryParentMap(
  registryItems: z.infer<typeof RegistryItemSchema>[],
): Map<string, z.infer<typeof RegistryItemSchema>> {
  const map = new Map<string, z.infer<typeof RegistryItemSchema>>()
  registryItems.forEach((item) => {
    if (!item.registryDependencies) {
      return
    }

    item.registryDependencies.forEach((dependency) => {
      map.set(dependency, item)
    })
  })
  return map
}

function getRegistryTypeAliasMap(): Map<string, string> {
  return new Map<string, string>([
    ['registry:ui', 'ui'],
    ['registry:lib', 'lib'],
    ['registry:hook', 'hooks'],
    ['registry:block', 'components'],
    ['registry:component', 'components'],
  ])
}

export function buildRegistry(url: string = 'https://ui.adrianub.dev/r'): {
  getRegistryIndex: () => Promise<z.infer<typeof RegistryIndexSchema> | undefined>
  getRegistryStyles: () => Promise<z.infer<typeof StylesSchema>>
  getRegistryIcons: () => Promise<z.infer<typeof IconsSchema>>
  getRegistryItem: (name: string, style: string) => Promise<z.infer<typeof RegistryItemSchema> | null>
  getRegistryBaseColor: (baseColor: string) => Promise<z.infer<typeof RegistryBaseColorSchema> | undefined>
  fetchTree: (style: string, tree: z.infer<typeof RegistryIndexSchema>) => Promise<z.infer<typeof RegistryIndexSchema> | undefined>
  getRegistryBaseColors: () => Promise<{ name: string, label: string }[]>
  resolveTree: (index: z.infer<typeof RegistryIndexSchema>, names: string[]) => Promise<z.infer<typeof RegistryIndexSchema>>
  getItemTargetPath: (config: Config, item: Pick<z.infer<typeof RegistryItemSchema>, 'type'>, override?: string) => Promise<string | null>
  getRegistryTypeAliasMap: () => Map<string, string>
  getRegistryParentMap: (registryItems: z.infer<typeof RegistryItemSchema>[]) => Map<string, z.infer<typeof RegistryItemSchema>>
  registryResolveItemsTree: (names: z.infer<typeof RegistryItemSchema>['name'][], config: Config) => Promise<z.infer<typeof RegistryResolvedItemsTreeSchema> | null>
} {
  return {
    getRegistryIndex: () => getRegistryIndex(url),
    getRegistryStyles: () => getRegistryStyles(url),
    getRegistryIcons: () => getRegistryIcons(url),
    getRegistryItem: (name: string, style: string) => getRegistryItem(url, name, style),
    getRegistryBaseColor: (baseColor: string) => getRegistryBaseColor(url, baseColor),
    fetchTree: (style: string, tree: z.infer<typeof RegistryIndexSchema>) => fetchTree(url, style, tree),
    getRegistryBaseColors: () => getRegistryBaseColors(),
    resolveTree: (index: z.infer<typeof RegistryIndexSchema>, names: string[]) => resolveTree(index, names),
    getItemTargetPath: (config: Config, item: Pick<z.infer<typeof RegistryItemSchema>, 'type'>, override?: string) => getItemTargetPath(config, item, override),
    getRegistryTypeAliasMap: () => getRegistryTypeAliasMap(),
    getRegistryParentMap: (registryItems: z.infer<typeof RegistryItemSchema>[]) => getRegistryParentMap(registryItems),
    registryResolveItemsTree: (names: z.infer<typeof RegistryItemSchema>['name'][], config: Config) => registryResolveItemsTree(url, names, config),
  }
}
