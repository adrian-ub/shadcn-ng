import { promises as fs } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { Project, ScriptKind, type SourceFile } from 'ts-morph'
import type { z } from 'zod'

import { transformCssVars } from '../transformers/transform-css-vars'
import { transformImport } from '../transformers/transform-import'
import { transformTwPrefixes } from './transform-tw-prefix'
import type { Config } from '../get-config'

import type { registryBaseColorSchema } from '../registry/schema'

export interface TransformOpts {
  filename: string
  raw: string
  config: Config
  baseColor?: z.infer<typeof registryBaseColorSchema>
}

export type Transformer<Output = SourceFile> = (
  opts: TransformOpts & {
    sourceFile: SourceFile
  }
) => Promise<Output>

const transformers: Transformer[] = [
  transformImport,
  transformCssVars,
  transformTwPrefixes,
]

const project = new Project({
  compilerOptions: {},
})

async function createTempSourceFile(filename: string): Promise<string> {
  const dir = await fs.mkdtemp(path.join(tmpdir(), 'shadcn-'))
  return path.join(dir, filename)
}

export async function transform(opts: TransformOpts): Promise<string> {
  const tempFile = await createTempSourceFile(opts.filename)
  const sourceFile = project.createSourceFile(tempFile, opts.raw, {
    scriptKind: ScriptKind.TSX,
  })

  for (const transformer of transformers) {
    transformer({ sourceFile, ...opts })
  }
  return sourceFile.getFullText()
}
