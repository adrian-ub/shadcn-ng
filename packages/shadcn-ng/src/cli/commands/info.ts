import path from 'node:path'
import process from 'node:process'

import { Command } from 'commander'

import { logger } from '../../utils/logger'

import { getConfig } from '../stages/get-config'
import { getProjectInfo } from '../stages/get-project-info'
import { header } from '../utils/header'

export const info = new Command()
  .name('info')
  .description('get information about your project')
  .option(
    '-c, --cwd <cwd>',
    'the working directory. defaults to the current directory.',
    process.cwd(),
  )
  .action(async (opts) => {
    header()

    opts.cwd = path.resolve(opts.cwd)
    logger.info('> project info')
    console.log(await getProjectInfo(opts.cwd))
    logger.info('> components.json')
    console.log(await getConfig(opts.cwd))
  })
