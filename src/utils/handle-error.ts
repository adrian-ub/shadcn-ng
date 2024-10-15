import process from 'node:process'

import * as p from '@clack/prompts'
import { z } from 'zod'

import { highlighter } from './highlighter'

export function handleError(error: unknown): void {
  p.log.error(
    `Something went wrong. Please check the error below for more details.`,
  )
  p.log.error(`If the problem persists, please open an issue on GitHub.`)
  p.log.error('')
  if (typeof error === 'string') {
    p.log.error(error)
    process.exit(1)
  }

  if (error instanceof z.ZodError) {
    p.log.error('Validation failed:')
    for (const [key, value] of Object.entries(error.flatten().fieldErrors)) {
      p.log.error(`- ${highlighter.info(key)}: ${value}`)
    }
    process.exit(1)
  }

  if (error instanceof Error) {
    p.log.error(error.message)
    process.exit(1)
  }

  process.exit(1)
}
