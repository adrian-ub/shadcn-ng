import type { z } from 'astro/zod'

import fs from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import process from 'node:process'

import { registry } from '@/registry'
import { styles } from '@/registry/registry-styles'
import { type RegistryEntry, registryEntrySchema, type registryItemTypeSchema } from '@/registry/schema'
import { Project, ScriptKind } from 'ts-morph'

const project = new Project({
  compilerOptions: {},
})

const REGISTRY_INDEX_WHITELIST: z.infer<typeof registryItemTypeSchema>[] = [
  'registry:ui',
  'registry:lib',
  'registry:theme',
  'registry:block',
]

export async function getStaticPaths(): Promise<{ params: { style: string, name: string }, props: { item: RegistryEntry } }[]> {
  return registry
    .filter(item => REGISTRY_INDEX_WHITELIST.includes(item.type))
    .flatMap((item) => {
      return styles.map(style => ({
        params: {
          style: style.name,
          name: item.name,
        },
        props: {
          item,
        },
      }))
    })
}

async function createTempSourceFile(filename: string): Promise<string> {
  const dir = await fs.mkdtemp(path.join(tmpdir(), 'shadcn-'))
  return path.join(dir, filename)
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
    item: RegistryEntry
  }
}): Promise<Response> {
  const { style } = params
  const { item } = props

  let files

  if (item.files) {
    files = await Promise.all(
      item.files.map(async (_file) => {
        const file
          = typeof _file === 'string'
            ? {
                path: _file,
                type: item.type,
                content: '',
                target: '',
              }
            : _file

        const content = await fs.readFile(
          path.join(process.cwd(), 'src', 'registry', style, file.path),
          'utf8',
        )

        const tempFile = await createTempSourceFile(file.path)

        const sourceFile = project.createSourceFile(tempFile, content, {
          scriptKind: ScriptKind.TS,
        })

        sourceFile.getVariableDeclaration('iframeHeight')?.remove()
        sourceFile.getVariableDeclaration('containerClassName')?.remove()
        sourceFile.getVariableDeclaration('description')?.remove()

        return {
          path: file.path,
          type: file.type,
          content: sourceFile.getText(),
          target: file.target,
        }
      }),
    )
  }

  const payload = registryEntrySchema
    .omit({
      source: true,
      category: true,
      subcategory: true,
      chunks: true,
    })
    .safeParse({
      ...item,
      files,
    })

  if (!payload.success) {
    return new Response()
  }

  return new Response(
    JSON.stringify(payload.data, null, 2),
  )
}
