import { highlighter } from "../../utils/highlighter"
import { logger } from "../../utils/logger"

import pkgJson from "../../../package.json"

export function header(): void {
  logger.break()
  logger.log(
    `${highlighter.success(`${pkgJson.name} `)}v${pkgJson.version}`
  )
  logger.break()
}
