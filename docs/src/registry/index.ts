import type { Registry } from 'shadcn-ng/registry'
import { registryItemSchema } from 'shadcn-ng/registry'
import { z } from 'zod'

import { blocks } from '~/registry/registry-blocks'
import { charts } from '~/registry/registry-charts'
import { examples } from '~/registry/registry-examples'
import { hooks } from '~/registry/registry-hooks'
import { internal } from '~/registry/registry-internal'
import { lib } from '~/registry/registry-lib'
import { themes } from '~/registry/registry-themes'
import { ui } from '~/registry/registry-ui'

const DEPRECATED_ITEMS: string[] = []

export const registry = {
  name: 'shadcn-ng',
  homepage: 'https://ui.adrianub.dev',
  items: z.array(registryItemSchema).parse(
    [
      {
        name: 'index',
        type: 'registry:style',
        dependencies: ['class-variance-authority', '@ngxi/lucide'],
        devDependencies: ['tw-animate-css'],
        registryDependencies: ['utils'],
        cssVars: {},
        files: [],
      },
      ...ui,
      ...blocks,
      ...charts,
      ...lib,
      ...hooks,
      ...themes,
      ...examples,
      ...internal,
    ]
      .filter((item) => {
        return !DEPRECATED_ITEMS.includes(item.name)
      })
      .map((item) => {
        if (item.name === 'accordion' && 'tailwind' in item) {
          delete item.tailwind
        }

        return item
      }),
  ),
} satisfies Registry
