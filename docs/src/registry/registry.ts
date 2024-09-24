import { blocks } from './blocks'
import { charts } from './charts'
import { examples } from './examples'
import { ui } from './ui'
import type { Registry } from './schema'

export const registry: Registry = [...ui, ...examples, ...blocks, ...charts]
