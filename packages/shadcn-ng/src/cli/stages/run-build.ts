import type { BuildOptions } from '../schemas/build'

import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

import * as v from 'valibot'

import { highlighter } from '../../utils/highlighter'
import { logger } from '../../utils/logger'
import { spinner } from '../../utils/spinner'

import { RegistryItemSchema, RegistrySchema } from '../../registry'
import { preFlightBuild } from './preflight-build'

export async function runBuild(options: BuildOptions): Promise<void> {
  const { resolvePaths } = await preFlightBuild(options)
  const content = await fs.readFile(resolvePaths.registryFile, 'utf-8')

  const result = v.safeParse(RegistrySchema, JSON.parse(content))

  if (!result.success) {
    logger.error(
      `Invalid registry file found at ${highlighter.info(
        resolvePaths.registryFile,
      )}.`,
    )
    process.exit(1)
  }

  const buildSpinner = spinner('Building registry...').start()

  for (const registryItem of result.output.items) {
    if (!registryItem.files) {
      continue
    }

    buildSpinner.text = `Building ${registryItem.name}...`

    registryItem.$schema
      = 'https://ui.adrianub.dev/schema/registry-item.json'

    // Loop through each file in the files array.
    for (const file of registryItem.files) {
      file.content = await fs.readFile(
        path.resolve(resolvePaths.cwd, file.path),
        'utf-8',
      )
    }

    // Validate the registry item.
    const result = v.safeParse(RegistryItemSchema, registryItem)
    if (!result.success) {
      logger.error(
        `Invalid registry item found for ${highlighter.info(
          registryItem.name,
        )}.`,
      )
      continue
    }

    // Write the registry item to the output directory.
    await fs.writeFile(
      path.resolve(resolvePaths.outputDir, `${result.output.name}.json`),
      JSON.stringify(result.output, null, 2),
    )
  }
  buildSpinner.succeed('Building registry.')
}
