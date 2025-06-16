import type { Options, Ora } from 'ora'
import ora from 'ora'

export function spinner(
  text: Options['text'],
  options?: {
    silent?: boolean
  },
): Ora {
  return ora({
    text,
    isSilent: options?.silent,
  })
}
