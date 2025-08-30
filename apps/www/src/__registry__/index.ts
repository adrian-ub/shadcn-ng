import type { Registry } from 'shadcn-ng/schema'
import type { Style } from '../registry/registry-styles'
import process from 'node:process'

import { registrySchema } from 'shadcn-ng/schema'

import { z } from 'zod'
import { registry } from '../registry'
import { styles } from '../registry/registry-styles'

const components = import.meta.glob(`../registry/**/**/*.ts`)

export const Index: Record<Style['name'], any> = {
  'default': {},
  'new-york': {},
}

async function buildRegistry(registry: Registry): Promise<void> {
  for (const style of styles) {
    for (const item of registry.items) {
      const resolveFiles = item.files?.map(file => `registry/${style.name}/${typeof file === 'string' ? file : file.path
      }`)

      if (!resolveFiles) {
        continue
      }

      const type = item.type.split(':')[1]

      // TODO: implement source file
      const sourceFilename = ''
      const chunks: {
        name: string
        description: string
        component: string
        file: string
        container: {
          className: string
        }
      }[] = []

      let componentPath = `../registry/${style.name}/${type}/${item.name}`

      if (item.files) {
        const files = item.files.map(file =>
          typeof file === 'string'
            ? { type: 'registry:page', path: file }
            : file,
        )
        if (files?.length) {
          componentPath = `../registry/${style.name}/${files[0].path}`
        }
      }

      const component = components[componentPath]

      Index[style.name][item.name] = {
        name: item.name,
        description: item.description ?? '',
        type: item.type,
        registryDependencies: item.registryDependencies ?? [],
        files: resolveFiles.map(file => file),
        component,
        source: sourceFilename,
        chunks: chunks.map(chunk => ({
          name: chunk.name,
          description: chunk.description ?? 'No description',
          component: chunk.component,
          file: chunk.file,
          container: {
            className: chunk.container?.className ?? '',
          },
        })),
      }
    }
  }
}

try {
  const result = z.safeParse(registrySchema, registry)

  if (!result.success) {
    console.error(result.error.issues.map(issue => issue.message).join('\n'))
    process.exit(1)
  }

  // eslint-disable-next-line antfu/no-top-level-await
  await buildRegistry(result.data)
}
catch (error) {
  console.error(error)
}
