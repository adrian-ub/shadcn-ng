import type { BuildOptions } from '../schemas/build'

import fs, { promises as fsPromises } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

import * as p from '@clack/prompts'
import c from 'picocolors'

import { ERRORS } from '../utils/errors'

export async function preFlightBuild(
  options: BuildOptions,
): Promise<{ errors: Record<string, boolean>, resolvePaths: { cwd: string, registryFile: string, outputDir: string } }> {
  const errors: Record<string, boolean> = {}

  const resolvePaths = {
    cwd: options.cwd,
    registryFile: path.resolve(options.cwd, options.registryFile),
    outputDir: path.resolve(options.cwd, options.outputDir),
  }

  // Ensure registry file exists.
  if (!fs.existsSync(resolvePaths.registryFile)) {
    errors[ERRORS.BUILD_MISSING_REGISTRY_FILE] = true
  }

  // Create output directory if it doesn't exist.
  await fsPromises.mkdir(resolvePaths.outputDir, { recursive: true })

  if (Object.keys(errors).length > 0) {
    if (errors[ERRORS.BUILD_MISSING_REGISTRY_FILE]) {
      p.log.error(
        `The path ${c.blue(
          resolvePaths.registryFile,
        )} does not exist.`,
      )
    }

    process.exit(1)
  }

  return {
    errors,
    resolvePaths,
  }
}
