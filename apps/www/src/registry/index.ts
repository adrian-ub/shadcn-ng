import type { Registry } from 'shadcn-ng/schema'
import { blocks } from './registry-blocks'
import { charts } from './registry-charts'
import { examples } from './registry-examples'
import { lib } from './registry-lib'
import { themes } from './registry-themes'
import { ui } from './registry-ui'

export const registry: Registry = {
  name: 'shadcn-ng',
  homepage: 'https://ui.adrianub.dev',
  items: [
    ...ui,
    ...blocks,
    ...charts,
    ...lib,
    ...themes,

    // Internal use only.
    ...examples,
  ],
}
