/* eslint-disable no-console */
import pc from 'picocolors'

export const logger = {
  error(args: string) {
    console.log(pc.red(args))
  },
  warn(args: string) {
    console.log(pc.yellow(args))
  },
  info(args: string) {
    console.log(pc.cyan(args))
  },
  success(args: string) {
    console.log(pc.green(args))
  },
  break() {
    console.log('')
  },
}
