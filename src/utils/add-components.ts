import * as p from '@clack/prompts'

import { handleError } from './handle-error'
import { registryResolveItemsTree } from './registry'
import { updateCssVars } from './updaters/update-css-vars'
import { updateDependencies } from './updaters/update-dependencies'
import { updateFiles } from './updaters/update-files'
import { updateTailwindConfig } from './updaters/update-tailwind-config'
import type { Config } from './get-config'

export async function addComponents(
  components: string[],
  config: Config,
  options: {
    overwrite?: boolean
    silent?: boolean
    isNewProject?: boolean
  },
): Promise<void> {
  options = {
    overwrite: false,
    silent: false,
    isNewProject: false,
    ...options,
  }

  const registrySpinner = p.spinner()
  registrySpinner.start('Checking registry.')
  const tree = await registryResolveItemsTree(components, config)
  if (!tree) {
    return handleError(new Error('Failed to fetch components from registry.'))
  }
  registrySpinner.stop(`Found ${components.length} component(s).`)

  await updateTailwindConfig(tree.tailwind?.config, config, {
    silent: options.silent,
  })
  await updateCssVars(tree.cssVars, config, {
    cleanupDefaultNextStyles: options.isNewProject,
    silent: options.silent,
  })

  await updateDependencies(tree.dependencies, config, {
    silent: options.silent,
  })
  await updateFiles(tree.files, config, {
    overwrite: options.overwrite,
    silent: options.silent,
  })

  if (tree.docs) {
    p.log.info(tree.docs)
  }
}
