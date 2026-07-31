import path from 'node:path'

import process from 'node:process'

import { Command } from 'commander'

import { handleError } from '../../utils/handle-error'
import { DocsOptionsSchema } from '../schemas/docs'

import { runDocs } from '../stages/run-docs'
import { header } from '../utils/header'

export const docs = new Command()
  .name('docs')
  .description('open the documentation for a component')
  .argument(
    '<components...>',
    'the components to open documentation for.',
  )
  .option(
    '-c, --cwd <cwd>',
    'the working directory. defaults to the current directory.',
    process.cwd(),
  )
  .action(async (components, opts) => {
    header()

    try {
      const options = DocsOptionsSchema.parse({
        components,
        cwd: path.resolve(opts.cwd),
      })

      await runDocs(options)
    }
    catch (error) {
      handleError(error)
    }
  })
