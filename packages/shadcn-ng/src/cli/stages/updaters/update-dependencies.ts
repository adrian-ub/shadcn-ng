import type { Config, RegistryItem } from '../../../registry'

import { installPackage } from '@antfu/install-pkg'
import { logger } from '../../../utils/logger'
import { spinner } from '../../../utils/spinner'
import { detect as detectPM } from 'package-manager-detector/detect'

export async function updateDependencies(
  dependencies: RegistryItem['dependencies'],
  config: Config,
): Promise<void> {
  dependencies = Array.from(new Set(dependencies))
  if (!dependencies?.length) {
    return
  }

  const dependenciesSpinner = spinner('Installing dependencies.').start()
  const pm = await detectPM({
    cwd: config.resolvedPaths.cwd,
  })

  if (!pm) {
    throw new Error('Could not detect package manager')
  }

  await installPackage(dependencies, {
    cwd: config.resolvedPaths.cwd,
    packageManager: pm.name,
    silent: true,
  })

  dependenciesSpinner.succeed('Dependencies installed.')
}
