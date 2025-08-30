import type { RegistryItem } from '@/src/registry/schema'
import type { Config } from '@/src/utils/get-config'
import { execa } from 'execa'
import { getPackageManager } from '@/src/utils/get-package-manager'
import { spinner } from '@/src/utils/spinner'

export async function updateDependencies(
  dependencies: RegistryItem['dependencies'],
  devDependencies: RegistryItem['devDependencies'],
  config: Config,
  options: {
    silent?: boolean
  },
) {
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
  const packageManager = await getUpdateDependenciesPackageManager(config)

  dependenciesSpinner?.start()

  await installWithPackageManager(
    packageManager,
    dependencies,
    devDependencies,
    config.resolvedPaths.cwd,
  )

  dependenciesSpinner?.succeed()
}

async function getUpdateDependenciesPackageManager(config: Config) {
  return getPackageManager(config.resolvedPaths.cwd)
}

async function installWithPackageManager(
  packageManager: Awaited<
    ReturnType<typeof getUpdateDependenciesPackageManager>
  >,
  dependencies: string[],
  devDependencies: string[],
  cwd: string,
) {
  if (packageManager === 'npm') {
    return installWithNpm(dependencies, devDependencies, cwd)
  }

  if (packageManager === 'deno') {
    return installWithDeno(dependencies, devDependencies, cwd)
  }

  if (dependencies?.length) {
    await execa(packageManager, ['add', ...dependencies], {
      cwd,
    })
  }

  if (devDependencies?.length) {
    await execa(packageManager, ['add', '-D', ...devDependencies], { cwd })
  }
}

async function installWithNpm(
  dependencies: string[],
  devDependencies: string[],
  cwd: string,
) {
  if (dependencies.length) {
    await execa(
      'npm',
      ['install', ...dependencies],
      { cwd },
    )
  }

  if (devDependencies.length) {
    await execa(
      'npm',
      ['install', '-D', ...devDependencies],
      { cwd },
    )
  }
}

async function installWithDeno(
  dependencies: string[],
  devDependencies: string[],
  cwd: string,
) {
  if (dependencies?.length) {
    await execa('deno', ['add', ...dependencies.map(dep => `npm:${dep}`)], {
      cwd,
    })
  }

  if (devDependencies?.length) {
    await execa(
      'deno',
      ['add', '-D', ...devDependencies.map(dep => `npm:${dep}`)],
      { cwd },
    )
  }
}
