#!/usr/bin/env node
import process from 'node:process'

import { Command } from 'commander'

import { mcp } from '@/src/commands/mcp'

import packageJson from '../package.json'

process.on('SIGINT', () => process.exit(0))
process.on('SIGTERM', () => process.exit(0))

async function main() {
  const program = new Command()
    .name('shadcn-ng')
    .description('add items from registries to your project')
    .version(
      packageJson.version || '1.0.0',
      '-v, --version',
      'display the version number',
    )

  program.addCommand(mcp)

  program.parse()
}

main()

export * from './registry/api'
