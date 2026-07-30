import path from 'node:path'
import process from 'node:process'

import { Command } from 'commander'
import { z } from 'zod'

import { highlighter } from '../../utils/highlighter'
import { logger } from '../../utils/logger'

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
  .option('--css-variables', 'use css variables for theming.', true)
  .option('--no-css-variables', 'do not use css variables for theming.')
  .action(async (components, opts) => {
    header()
    try {
      const options = InitSchema.parse({
        ...opts,
        cwd: path.resolve(opts.cwd),
        components,
      })

      await runInit(options)

      logger.success('Success! Project initialization completed.')
      logger.break()
      logger.log(`You may now add components using ${highlighter.info(`${pkgJson.name} add [components...]`)}`)
    }
    catch (error) {
      handleError(error)
    }
  })
