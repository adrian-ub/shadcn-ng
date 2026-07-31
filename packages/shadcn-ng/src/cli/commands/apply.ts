import path from 'node:path'

import process from 'node:process'

import { Command } from 'commander'

import { handleError } from '../../utils/handle-error'
import { ApplyOptionsSchema } from '../schemas/apply'

import { runApply } from '../stages/run-apply'
import { header } from '../utils/header'

export const apply = new Command()
  .name('apply')
  .description('apply a component to your project')
  .argument(
    '[components...]',
    'the components to apply.',
  )
  .option('-y, --yes', 'skip confirmation prompt.', false)
  .option('-o, --overwrite', 'overwrite existing files.', false)
  .option(
    '-c, --cwd <cwd>',
    'the working directory. defaults to the current directory.',
    process.cwd(),
  )
  .action(async (components, opts) => {
    header()

    try {
      const options = ApplyOptionsSchema.parse({
        ...opts,
        components,
        cwd: path.resolve(opts.cwd),
      })

      await runApply(options)
    }
    catch (error) {
      handleError(error)
    }
  })
