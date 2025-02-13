import path from 'node:path'
import process from 'node:process'

import { Command } from 'commander'
import * as v from 'valibot'

import { handleError } from '../../utils/handle-error'
import { BuildOptionsSchema } from '../schemas/build'
import { runBuild } from '../stages/run-build'
import { header } from '../utils/header'

export const build = new Command()
  .name('build')
  .description('build components for a shadcn registry')
  .argument('[registry]', 'path to registry.json file', './registry.json')
  .option(
    '-o, --output <path>',
    'destination directory for json files',
    './public/r',
  )
  .option(
    '-c, --cwd <cwd>',
    'the working directory. defaults to the current directory.',
    process.cwd(),
  )
  .action(async (registry: string, opts) => {
    header()

    try {
      const options = v.parse(BuildOptionsSchema, {
        cwd: path.resolve(opts.cwd),
        registryFile: registry,
        outputDir: opts.output,
      })

      await runBuild(options)
    }
    catch (error) {
      handleError(error)
    }
  })
