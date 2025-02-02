import * as p from '@clack/prompts'
import c from 'picocolors'

import pkgJson from '../../../package.json'

export function header(): void {
  console.log('\n')
  p.intro(`${c.green(`${pkgJson.name} `)}${c.dim(`v${pkgJson.version}`)}`)
}
