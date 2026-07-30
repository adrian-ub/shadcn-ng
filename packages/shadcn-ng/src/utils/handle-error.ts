import process from "node:process"
import { highlighter } from "./highlighter"
import { logger } from "./logger"
import { z } from "zod"

export function handleError(error: unknown) {
  logger.break()
  logger.error(
    "Something went wrong. Please check the error below for more details."
  )
  logger.error("If the problem persists, please open an issue on GitHub.")
  logger.error("")
  if (typeof error === "string") {
    logger.error(error)
    process.exit(1)
  }

  if (error instanceof z.ZodError) {
    logger.error("Validation failed:")
    for (const [key, value] of Object.entries(error.flatten().fieldErrors)) {
      logger.error(`- ${highlighter.info(key)}: ${value}`)
    }
    process.exit(1)
  }

  if (error instanceof Error) {
    logger.error(error.message)
    process.exit(1)
  }

  process.exit(1)
}
