import process from 'node:process'

import { logger } from './logger'

export function handleError(error: unknown): void {
  if (typeof error === 'string') {
    logger.error(error)
    process.exit(1)
  }

  if (error instanceof Error) {
    logger.error(error.message)
    process.exit(1)
  }

  logger.error('Something went wrong. Please try again.')
  process.exit(1)
}
