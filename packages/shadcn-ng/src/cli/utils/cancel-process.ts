import process from "node:process"
import { logger } from "../../utils/logger"

export function cancelProcess(exitCode = 0): void {
  logger.error("Operation cancelled.")
  process.exit(exitCode)
}
