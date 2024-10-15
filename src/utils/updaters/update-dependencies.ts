import { installPackage } from '@antfu/install-pkg'
import * as p from '@clack/prompts'

import type { Config } from '../get-config'
import type { RegistryItem } from '../registry/schema'

export async function updateDependencies(
  dependencies: RegistryItem['dependencies'],
  config: Config,
  _options: {
    silent?: boolean
  },
): Promise<void> {
  dependencies = Array.from(new Set(dependencies))

  if (!dependencies?.length) {
    return
  }

  const dependenciesSpinner = p.spinner()
  dependenciesSpinner.start('Installing dependencies.')

  await installPackage(dependencies, {
    cwd: config.resolvedPaths.cwd,
    silent: true,
  })

  dependenciesSpinner.stop(`Installed dependencies.`)
}
