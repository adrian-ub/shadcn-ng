import type { Registry } from 'shadcn-ng/schema'
import { registryItemSchema } from 'shadcn-ng/schema'
import { z } from 'zod/v4'

import { blocks } from '@/registry/registry-blocks'
import { charts } from '@/registry/registry-charts'
import { examples } from '@/registry/registry-examples'
import { hooks } from '@/registry/registry-hooks'
import { internal } from '@/registry/registry-internal'
import { lib } from '@/registry/registry-lib'
import { themes } from '@/registry/registry-themes'
import { ui } from '@/registry/registry-ui'

const DEPRECATED_ITEMS: string[] = []

const NEW_YORK_V4_STYLE = {
  type: 'registry:style',
  dependencies: ['class-variance-authority', '@ngxi/lucide'],
  devDependencies: ['tw-animate-css'],
  registryDependencies: ['utils'],
  cssVars: {},
  files: [],
}

export const registry = {
  name: 'shadcn-ng',
  homepage: 'https://ui.adrianub.dev',
  items: z.array(registryItemSchema).parse(
    [
      {
        name: 'index',
        ...NEW_YORK_V4_STYLE,
      },
      {
        name: 'style',
        ...NEW_YORK_V4_STYLE,
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
      }),
  ),
} satisfies Registry
