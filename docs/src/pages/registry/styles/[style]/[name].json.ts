import { readFileSync } from 'node:fs'
import path, { basename } from 'node:path'
import process from 'node:process'
import { registry } from '@/registry/registry'
import { styles } from '@/registry/styles'
import type { RegistryEntry } from '@/registry/schema'

export async function getStaticPaths(): Promise<{ params: { style: 'default' | 'new-york', name: string }, props: { componentRegistry: { name: string, type: 'components:ui' | 'components:component' | 'components:example' | 'components:block' | 'components:chart', files: string[], description?: string | undefined, dependencies?: string[] | undefined, devDependencies?: string[] | undefined, registryDependencies?: string[] | undefined, source?: string | undefined, category?: string | undefined, subcategory?: string | undefined, chunks?: { name: string, description: string, file: string, code?: string | undefined, component?: any, container?: { className?: string | null | undefined } | undefined }[] | undefined } } }[]> {
  return registry
    .filter(item => item.type === 'components:ui')
    .flatMap((item) => {
      return styles.map(style => ({
        params: {
          style: style.name,
          name: item.name,
        },
        props: {
          componentRegistry: item,
        },
      }))
    })
}

export async function GET({
  params,
  props,
}: {
  params: {
    style: string
    name: string
  }
  props: {
    componentRegistry: RegistryEntry
  }
}): Promise<Response> {
  const { style } = params
  const { componentRegistry } = props
  const files = componentRegistry.files.map((file) => {
    const content = readFileSync(
      path.join(process.cwd(), 'src', 'registry', style, file),
      'utf8',
    )

    return {
      name: basename(file),
      content,
    }
  })

  return new Response(
    JSON.stringify(
      {
        ...componentRegistry,
        files,
      },
      null,
      2,
    ),
  )
}
