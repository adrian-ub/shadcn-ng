import type { Config } from '../../registry/schema'

import * as p from '@clack/prompts'

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
  },
): Promise<void> {
  const registrySpinner = p.spinner()
  registrySpinner.start('Checking registry.')
  const tree = await registryResolveItemsTree(components, config)
  if (!tree) {
    return handleError(new Error('Failed to fetch components from registry.'))
  }
  registrySpinner.stop('Registry checked.')
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
  })

  if (tree.docs) {
    p.log.info(tree.docs)
  }
}
