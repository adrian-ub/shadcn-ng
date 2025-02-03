import type { AddOptionsSchema } from '../schemas/add'

import * as p from '@clack/prompts'
import * as v from 'valibot'

import { handleError } from '../../utils/handle-error'
import { getRegistryIndex } from '../registry'
import { verifyIsCancelPrompt } from '../utils/cancel-process'

export async function promptForRegistryComponents(
  options: v.InferOutput<typeof AddOptionsSchema>,
): Promise<string[]> {
  const registryIndex = await getRegistryIndex()
  if (!registryIndex) {
    handleError(new Error('Failed to fetch registry index.'))
    return []
  }

  if (options.all) {
    return registryIndex.map(entry => entry.name)
  }

  if (options.components?.length) {
    return options.components
  }

  const components = await p.multiselect({
    message: 'Which components would you like to add?',
    options: registryIndex
      .filter(entry => entry.type === 'registry:ui')
      .map(entry => ({
        label: entry.name,
        value: entry.name,
      })),
    required: true,
  })

  verifyIsCancelPrompt(components)

  const result = v.safeParse(v.array(v.string()), components)
  if (!result.success) {
    handleError(new Error('Something went wrong. Please try again.'))
    return []
  }
  return result.output
}
