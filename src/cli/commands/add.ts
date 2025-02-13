import path from 'node:path'

import process from 'node:process'

import { Command } from 'commander'

import * as v from 'valibot'

import { handleError } from '../../utils/handle-error'
import { AddOptionsSchema } from '../schemas/add'

import { runAdd } from '../stages/run-add'
import { header } from '../utils/header'

export const add = new Command()
  .name('add')
  .description('add a component to your project')
  .argument(
    '[components...]',
    'the components to add or a url to the component.',
  )
  .option('-y, --yes', 'skip confirmation prompt.', false)
  .option('-o, --overwrite', 'overwrite existing files.', false)
  .option(
    '-c, --cwd <cwd>',
    'the working directory. defaults to the current directory.',
    process.cwd(),
  )
  .option('-a, --all', 'add all available components', false)
  .option('-p, --path <path>', 'the path to add the component to.')
  .action(async (components, opts) => {
    header()

    try {
      const options = v.parse(AddOptionsSchema, {
        ...opts,
        components,
        cwd: path.resolve(opts.cwd),
      })

      await runAdd(options)
    }
    catch (error) {
      handleError(error)
    }
  })
