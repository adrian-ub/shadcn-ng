import path from 'node:path'

import process from 'node:process'

import { Command } from 'commander'

import { handleError } from '../../utils/handle-error'
import { SearchOptionsSchema } from '../schemas/search'

import { runSearch } from '../stages/run-search'
import { header } from '../utils/header'

export const search = new Command()
  .name('search')
  .description('search the registry for components.')
  .argument('[query]', 'the search query. omitted to list every component.')
  .option(
    '-c, --cwd <cwd>',
    'the working directory. defaults to the current directory.',
    process.cwd(),
  )
  .action(async (query, opts) => {
    header()

    try {
      const options = SearchOptionsSchema.parse({
        query: query?.trim() || undefined,
        cwd: path.resolve(opts.cwd),
      })

      await runSearch(options)
    }
    catch (error) {
      handleError(error)
    }
  })
