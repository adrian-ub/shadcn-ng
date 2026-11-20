import path from 'node:path'
import process from 'node:process'

import * as p from '@clack/prompts'
import { Command } from 'commander'

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
    p.log.info('> project info')
    console.log(await getProjectInfo(opts.cwd))
    p.log.info('> components.json')
    console.log(await getConfig(opts.cwd))
  })
