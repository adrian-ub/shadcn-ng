import process from 'node:process'
import { buildRegistry } from '../registry/api'

const REGISTRY_URL = process.env.REGISTRY_URL ?? 'https://ui.adrianub.dev/r'

export const {
  getRegistryStyles,
  getRegistryBaseColors,
  registryResolveItemsTree,
  getRegistryBaseColor,
  getRegistryIndex,
  fetchTree,
  getItemTargetPath,
} = buildRegistry(REGISTRY_URL)
