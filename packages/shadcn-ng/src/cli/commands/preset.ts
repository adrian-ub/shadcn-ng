import path from 'node:path'

import process from 'node:process'

import { Command } from 'commander'

import { handleError } from '../../utils/handle-error'
import { PresetApplyOptionsSchema } from '../schemas/preset'

import { runPresetApply, runPresetList } from '../stages/run-preset'
import { header } from '../utils/header'

const presetList = new Command()
  .name('list')
  .description('list available presets.')
  .action(async () => {
    header()

    try {
      await runPresetList()
    }
    catch (error) {
      handleError(error)
    }
  })

const presetApply = new Command()
  .name('apply')
  .description('apply a preset to your project.')
  .argument('<preset>', 'the preset to apply.')
  .option('-y, --yes', 'skip confirmation prompt.', false)
  .option('-o, --overwrite', 'overwrite existing files.', false)
  .option(
    '-c, --cwd <cwd>',
    'the working directory. defaults to the current directory.',
    process.cwd(),
  )
  .action(async (name, opts) => {
    header()

    try {
      const options = PresetApplyOptionsSchema.parse({
        name,
        cwd: path.resolve(opts.cwd),
        yes: opts.yes,
        overwrite: opts.overwrite,
      })

      await runPresetApply(options)
    }
    catch (error) {
      handleError(error)
    }
  })

export const preset = new Command()
  .name('preset')
  .description('manage component presets.')
  .addCommand(presetList)
  .addCommand(presetApply)
  .action(() => {
    preset.outputHelp()
  })
