import { Command } from 'commander'

import { description, name, version } from '../../package.json'
import { add } from './commands/add'
import { apply } from './commands/apply'
import { build } from './commands/build'
import { diff } from './commands/diff'
import { docs } from './commands/docs'
import { eject } from './commands/eject'
import { info } from './commands/info'
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
  program.addCommand(apply)
  program.addCommand(diff)
  program.addCommand(docs)
  program.addCommand(eject)
  program.addCommand(info)
  program.addCommand(build)

  program.parse()
}

main()
