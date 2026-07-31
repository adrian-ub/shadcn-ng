import path from 'node:path'

import process from 'node:process'

import { Command } from 'commander'

import { handleError } from '../../utils/handle-error'
import { MigrateOptionsSchema } from '../schemas/migrate'

import { runMigrate } from '../stages/run-migrate'
import { header } from '../utils/header'

export const migrate = new Command()
  .name('migrate')
  .description('migrate an existing shadcn-ng config to the new format.')
  .argument(
    '[path]',
    'path to the config file. defaults to components.json in the working directory.',
  )
  .option(
    '--dry-run',
    'print the migrated config without writing it.',
    false,
  )
  .option(
    '-c, --cwd <cwd>',
    'the working directory. defaults to the current directory.',
    process.cwd(),
  )
  .action(async (migratePath, opts) => {
    header()

    try {
      const options = MigrateOptionsSchema.parse({
        path: migratePath,
        cwd: path.resolve(opts.cwd),
        dryRun: opts.dryRun,
      })

      await runMigrate(options)
    }
    catch (error) {
      handleError(error)
    }
  })
