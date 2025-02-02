import process from 'node:process'

import * as p from '@clack/prompts'

export function verifyIsCancelPrompt(value: unknown, exitCode = 0): void {
  if (p.isCancel(value)) {
    cancelProcess(exitCode)
  }
}

export function cancelProcess(exitCode: number = 0): void {
  p.cancel('Operation cancelled.')
  process.exit(exitCode)
}
