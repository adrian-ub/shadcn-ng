#!/usr/bin/env node
import process from 'node:process'
import { cli } from 'cleye'

import packageJson from '../package.json'

process.on('SIGINT', () => process.exit(0))
process.on('SIGTERM', () => process.exit(0))

cli({
  name: 'shadcn-ng',
  commands: [],
  version: packageJson.version || '1.0.0',
})
