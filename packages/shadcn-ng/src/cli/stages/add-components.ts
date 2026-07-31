import type { Config } from '../../registry/schema'

import { logger } from '../../utils/logger'
import { spinner } from '../../utils/spinner'

import { handleError } from '../../utils/handle-error'
import { registryResolveItemsTree } from '../registry'
import { getProjectTailwindVersionFromConfig } from './get-project-info'
import { updateCssVars } from './updaters/update-css-vars'
import { updateDependencies } from './updaters/update-dependencies'
import { updateFiles } from './updaters/update-files'
import { updateTailwindConfig } from './updaters/update-tailwind-config'

export async function addComponents(
  components: string[],
  config: Config,
  options: {
    overwrite?: boolean
    path?: string
  },
): Promise<void> {
  options = {
    overwrite: false,
    ...options,
  }

  return await addProjectComponents(components, config, options)
}

async function addProjectComponents(
  components: string[],
  config: Config,
  options: {
    overwrite?: boolean
    path?: string
  },
): Promise<void> {
  const registrySpinner = spinner('Checking registry.').start()
  const tree = await registryResolveItemsTree(components, config)
  if (!tree) {
    return handleError(new Error('Failed to fetch components from registry.'))
  }
  registrySpinner.succeed('Registry checked.')
  const tailwindVersion = await getProjectTailwindVersionFromConfig(config)

  await updateTailwindConfig(tree.tailwind?.config, config, {
    tailwindVersion,
  })

  await updateCssVars(tree.cssVars, config, {
    tailwindVersion,
    tailwindConfig: tree.tailwind?.config,
  })

  await updateDependencies(tree.dependencies, config)

  await updateFiles(tree.files, config, {
    overwrite: options.overwrite,
    path: options.path,
  })

  if (tree.docs) {
    logger.info(tree.docs)
  }
}
