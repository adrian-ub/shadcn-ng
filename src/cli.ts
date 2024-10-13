import process from 'node:process'
import { Command } from 'commander'

import { description, name, version } from '../package.json'

import { add } from './commands/add'
import { diff } from './commands/diff'
import { init } from './commands/init'

process.on('SIGINT', () => process.exit(0))
process.on('SIGTERM', () => process.exit(0))

async function main(): Promise<void> {
  const program = new Command()
    .name(name)
    .description(description)
    .version(
      version,
      '-v, --version',
      'display the version number',
    )

  program.addCommand(init).addCommand(add).addCommand(diff)

  program.parse()
}

main()
