import { registryItemSchema } from 'shadcn-ng/schema'
import { z } from 'zod/v4'

export async function getAllBlockIds(
  types: z.infer<typeof registryItemSchema>['type'][] = [
    'registry:block',
    'registry:internal',
  ],
  categories: string[] = [],
): Promise<string[]> {
  const blocks = await getAllBlocks(types, categories)

  return blocks.map(block => block.name)
}

export async function getAllBlocks(
  types: z.infer<typeof registryItemSchema>['type'][] = [
    'registry:block',
    'registry:internal',
  ],
  categories: string[] = [],
) {
  const { Index } = await import('@/registry/__index__')
  const index = z.record(z.string(), registryItemSchema).parse(Index)

  return Object.values(index).filter(
    block =>
      types.includes(block.type)
      && (categories.length === 0
        || block.categories?.some(category => categories.includes(category)))
      && !block.name.startsWith('chart-'),
  )
}
