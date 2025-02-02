import process from 'node:process'
import { buildRegistry } from '../registry/api'

const REGISTRY_URL = process.env.REGISTRY_URL ?? 'https://ui.adrianub.dev/r'

export const {
  getRegistryStyles,
  getRegistryBaseColors,
} = buildRegistry(REGISTRY_URL)
