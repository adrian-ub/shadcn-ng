import path from 'node:path'

import process from 'node:process'

import { Command } from 'commander'

import { handleError } from '../../utils/handle-error'
import { EjectOptionsSchema } from '../schemas/eject'

import { runEject } from '../stages/run-eject'
import { header } from '../utils/header'

export const eject = new Command()
  .name('eject')
  .description('eject components as editable source files')
  .argument(
    '[components...]',
    'the components to eject.',
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
      const options = EjectOptionsSchema.parse({
        ...opts,
        components,
        cwd: path.resolve(opts.cwd),
      })

      await runEject(options)
    }
    catch (error) {
      handleError(error)
    }
  })
