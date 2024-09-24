#!/usr/bin/env node
import process from 'node:process'

import { defineCommand, runMain } from 'citty'

import { description, name, version } from '../package.json'

import { add } from './commands/add'
import { diff } from './commands/diff'
import { init } from './commands/init'

process.on('SIGINT', () => process.exit(0))
process.on('SIGTERM', () => process.exit(0))

const main = defineCommand({
  meta: {
    name,
    version,
    description,
  },
  subCommands: {
    init,
    add,
    diff,
  },
})

runMain(main)
