import { blocks } from './registry-blocks'
import { charts } from './registry-charts'
import { examples } from './registry-examples'
import { lib } from './registry-lib'
import { themes } from './registry-themes'
import { ui } from './registry-ui'
import type { Registry } from './schema'

export const registry: Registry = [
  ...ui,
  ...examples,
  ...blocks,
  ...charts,
  ...lib,
  ...themes,
]