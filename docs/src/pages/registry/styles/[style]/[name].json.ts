import { readFileSync } from 'node:fs'
import path, { basename } from 'node:path'
import { registry } from '@/registry/registry'
import { styles } from '@/registry/styles'
import type { RegistryEntry } from '@/registry/schema'

export async function getStaticPaths() {
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
}) {
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
