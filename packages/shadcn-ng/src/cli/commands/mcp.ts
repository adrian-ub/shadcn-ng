import path from 'node:path'

import process from 'node:process'

import { Command } from 'commander'

import { handleError } from '../../utils/handle-error'
import { McpOptionsSchema } from '../schemas/mcp'

import { runMcp } from '../stages/run-mcp'
import { header } from '../utils/header'

export const mcp = new Command()
  .name('mcp')
  .description('MCP server for AI tools (not yet implemented).')
  .option(
    '-c, --cwd <cwd>',
    'the working directory. defaults to the current directory.',
    process.cwd(),
  )
  .action(async (opts) => {
    header()

    try {
      const options = McpOptionsSchema.parse({
        cwd: path.resolve(opts.cwd),
      })

      await runMcp(options)
    }
    catch (error) {
      handleError(error)
    }
  })
