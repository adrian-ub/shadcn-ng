import { Command } from 'commander'

import { description, name, version } from '../../package.json'
import { add } from './commands/add'
import { init } from './commands/init'

async function main(): Promise<void> {
  const program = new Command()
    .name(name)
    .description(description)
    .version(
      version,
      '-v, --version',
      'display the version number',
    )

  program.addCommand(init)
  program.addCommand(add)

  program.parse()
}

main()
