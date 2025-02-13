import process from 'node:process'
import * as p from '@clack/prompts'
import { ValiError } from 'valibot'

export function handleError(error: unknown): void {
  p.log.error(
    `Something went wrong. Please check the error below for more details.`,
  )
  p.log.error(`If the problem persists, please open an issue on GitHub.`)

  if (typeof error === 'string') {
    p.log.error(error)
    process.exit(1)
  }

  if (error instanceof ValiError) {
    p.log.error('Validation failed:')
    for (const issue of error.issues) {
      p.log.error(`- ${issue.message}`)
    }
    process.exit(1)
  }

  if (error instanceof Error) {
    p.log.error(error.message)
    process.exit(1)
  }

  process.exit(1)
}
