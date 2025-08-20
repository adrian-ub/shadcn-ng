import type { SourceFile } from 'ts-morph'
import type { z } from 'zod'
import type { registryBaseColorSchema } from '@/src/registry/schema'
import type { Config } from '@/src/utils/get-config'
import { promises as fs } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { Project, ScriptKind } from 'ts-morph'
import { transformCssVars } from '@/src/utils/transformers/transform-css-vars'
import { transformIcons } from '@/src/utils/transformers/transform-icons'
import { transformImport } from '@/src/utils/transformers/transform-import'

import { transformTwPrefixes } from './transform-tw-prefix'

export interface TransformOpts {
  filename: string
  raw: string
  config: Config
  baseColor?: z.infer<typeof registryBaseColorSchema>
  isRemote?: boolean
}

export type Transformer<Output = SourceFile> = (
  opts: TransformOpts & {
    sourceFile: SourceFile
  }
) => Promise<Output>

const project = new Project({
  compilerOptions: {},
})

async function createTempSourceFile(filename: string) {
  const dir = await fs.mkdtemp(path.join(tmpdir(), 'shadcn-'))
  return path.join(dir, filename)
}

export async function transform(
  opts: TransformOpts,
  transformers: Transformer[] = [
    transformImport,
    transformCssVars,
    transformTwPrefixes,
    transformIcons,
  ],
) {
  const tempFile = await createTempSourceFile(opts.filename)
  const sourceFile = project.createSourceFile(tempFile, opts.raw, {
    scriptKind: ScriptKind.TSX,
  })

  for (const transformer of transformers) {
    await transformer({ sourceFile, ...opts })
  }

  return sourceFile.getText()
}
