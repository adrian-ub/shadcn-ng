import type { CollectionEntry } from 'astro:content'

export type TreeNode
  = | {
    type: 'page'
    id: string
    name: string
    description?: string
    url: string
    external: boolean
  }
  | {
    type: 'folder'
    id: string
    name: string
    children: TreeNode[]
  }

export type PageNode = Extract<TreeNode, { type: 'page' }>
export type FolderNode = Extract<TreeNode, { type: 'folder' }>

function cleanUrl(id: string, basePath = '') {
  const slug = id
    .replace(/\([^)]*\)\//g, '')
    .replace(/\/index$/, '')
    .replace(/^index$/, '')

  return `${basePath}/${slug}`.replace(/\/+$/, '') || '/'
}

type DocsEntry = CollectionEntry<'docs'>
type MetaEntry = CollectionEntry<'meta'>

interface LoaderOptions {
  baseUrl: string
  source: {
    pageData: DocsEntry[]
    metaData: MetaEntry[]
  }
}

export function loader(options: LoaderOptions) {
  const { baseUrl, source } = options
  const { pageData, metaData } = source

  const resolveNode = (page: string, base = ''): TreeNode | null => {
    const id = base ? `${base}/${page}` : page

    const doc = pageData.find(d => d.id === id)
    if (doc) {
      return {
        type: 'page',
        id: doc.id,
        name: doc.data.title,
        description: doc.data.description,
        url: cleanUrl(doc.id, baseUrl),
        external: false,
      } satisfies PageNode
    }

    const meta = metaData.find(m => m.id === id)
    if (meta) {
      return {
        type: 'folder',
        id: meta.id,
        name: meta.data.title || meta.id,
        children:
          (meta.data.pages
            ?.map((p: string) => resolveNode(p, meta.id))
            .filter(Boolean) as TreeNode[]) || [],
      } satisfies FolderNode
    }

    const match = page.match(/\[(.*?)\]\((.*?)\)/)
    if (match) {
      return {
        type: 'page',
        id: page,
        name: match[1],
        url: match[2],
        external: match[2].startsWith('http'),
      } satisfies PageNode
    }

    return null
  }

  const root = metaData.find(m => m.data.root)
  if (!root)
    throw new Error('No se encontró root meta.json')

  return {
    pageTree: {
      type: 'folder',
      id: 'root',
      name: '',
      children:
        root.data.pages
          ?.map((p: string) => resolveNode(p)!)
          .filter(Boolean) || [],
    } satisfies FolderNode,

    generateParams: () =>
      pageData.map((page) => {
        const slug = page.id
          .replace(/^\(root\)\//, '')
          .replace(/\.mdx?$/, '')
          .replace(/\/index$/, '')
          .replace(/^index$/, '/')

        return {
          params: { slug },
          props: { page },
        }
      }),
  }
}
