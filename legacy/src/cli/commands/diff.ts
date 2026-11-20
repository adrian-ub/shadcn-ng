import process from 'node:process'

import { Command } from 'commander'
import * as v from 'valibot'

import { handleError } from '../../utils/handle-error'
import { DiffOptionsSchema } from '../schemas/diff'
import { runDiff } from '../stages/run-diff'
import { header } from '../utils/header'

export const diff = new Command()
  .name('diff')
  .description('check for updates against the registry')
  .argument('[component]', 'the component name')
  .option('-y, --yes', 'skip confirmation prompt.', false)
  .option(
    '-c, --cwd <cwd>',
    'the working directory. defaults to the current directory.',
    process.cwd(),
  )
  .action(async (name, opts) => {
    header()
    try {
      const options = v.parse(DiffOptionsSchema, {
        component: name,
        ...opts,
      })

      await runDiff(options)
    }
    catch (error) {
      handleError(error)
    }
  })
