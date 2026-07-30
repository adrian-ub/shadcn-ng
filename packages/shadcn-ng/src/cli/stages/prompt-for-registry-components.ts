import type { AddOptionsSchema } from '../schemas/add'

import * as v from 'valibot'

import { handleError } from '../../utils/handle-error'
import { getRegistryIndex } from '../registry'
import { cancelProcess } from '../utils/cancel-process'
import prompts from 'prompts'

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

  const { value: components } = await prompts({
    type: 'multiselect',
    name: 'value',
    message: 'Which components would you like to add?',
    choices: registryIndex
      .filter(entry => entry.type === 'registry:ui')
      .map(entry => ({
        title: entry.name,
        value: entry.name,
      })),
    instructions: false,
  }, { onCancel: () => cancelProcess() })

  const result = v.safeParse(v.array(v.string()), components)
  if (!result.success) {
    handleError(new Error('Something went wrong. Please try again.'))
    return []
  }
  return result.output
}
