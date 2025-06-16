import type { RegistryItem } from '~/src/registry/schema'
import type { Config } from '~/src/utils/get-config'

import { x } from 'tinyexec'

import { getPackageManager } from '~/src/utils/get-package-manager'
import { spinner } from '~/src/utils/spinner'

export async function updateDependencies(
  dependencies: RegistryItem['dependencies'],
  devDependencies: RegistryItem['devDependencies'],
  config: Config,
  options: {
    silent?: boolean
  },
): Promise<void> {
  dependencies = Array.from(new Set(dependencies))
  devDependencies = Array.from(new Set(devDependencies))

  if (!dependencies?.length && !devDependencies?.length) {
    return
  }

  options = {
    silent: false,
    ...options,
  }

  const dependenciesSpinner = spinner(`Installing dependencies.`, {
    silent: options.silent,
  })?.start()
  const packageManager = await getPackageManager(config.resolvedPaths.cwd)

  dependenciesSpinner?.start()

  if (dependencies?.length) {
    await x(
      packageManager,
      [
        packageManager === 'npm' ? 'install' : 'add',
        ...(packageManager === 'deno'
          ? dependencies.map(dep => `npm:${dep}`)
          : dependencies),
      ],
      {
        nodeOptions: {
          cwd: config.resolvedPaths.cwd,
        },
      },
    )
  }

  if (devDependencies?.length) {
    await x(
      packageManager,
      [
        packageManager === 'npm' ? 'install' : 'add',
        '-D',
        ...(packageManager === 'deno'
          ? devDependencies.map(dep => `npm:${dep}`)
          : devDependencies),
      ],
      {
        nodeOptions: {
          cwd: config.resolvedPaths.cwd,
        },
      },
    )
  }

  dependenciesSpinner?.succeed()
}
