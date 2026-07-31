import path from 'node:path'

import process from 'node:process'

import { Command } from 'commander'

import { handleError } from '../../utils/handle-error'
import { ViewOptionsSchema } from '../schemas/view'

import { runView } from '../stages/run-view'
import { header } from '../utils/header'

export const view = new Command()
  .name('view')
  .description('view the source of a registry component.')
  .argument('<component>', 'the component to view.')
  .option(
    '-c, --cwd <cwd>',
    'the working directory. defaults to the current directory.',
    process.cwd(),
  )
  .action(async (component, opts) => {
    header()

    try {
      const options = ViewOptionsSchema.parse({
        component,
        cwd: path.resolve(opts.cwd),
      })

      await runView(options)
    }
    catch (error) {
      handleError(error)
    }
  })
