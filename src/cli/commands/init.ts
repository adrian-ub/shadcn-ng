import path from 'node:path'
import process from 'node:process'

import * as p from '@clack/prompts'
import { Command } from 'commander'
import c from 'picocolors'
import * as v from 'valibot'

import pkgJson from '../../../package.json'
import { handleError } from '../../utils/handle-error'
import { InitSchema } from '../schemas/init'
import { runInit } from '../stages/run-init'
import { header } from '../utils/header'

export const init = new Command()
  .name('init')
  .description('initialize your project and install dependencies')
  .argument(
    '[components...]',
    'the components to add or a url to the component.',
  )
  .option(
    '-c, --cwd <cwd>',
    'the working directory. defaults to the current directory.',
    process.cwd(),
  )
  .option('-f, --force', 'force overwrite of existing configuration.', false)
  .option('-d, --defaults,', 'use default configuration.', false)
  .option('-y, --yes', 'skip confirmation prompt.', true)
  .action(async (components, opts) => {
    header()
    try {
      const options = v.parse(InitSchema, {
        ...opts,
        cwd: path.resolve(opts.cwd),
        components,
      })

      await runInit(options)

      p.log.success(c.green('Success! Project initialization completed.'))
      p.outro(`You may now add components using ${c.blue(`${pkgJson.name} add [components...]`)}`)
    }
    catch (error) {
      handleError(error)
    }
  })
