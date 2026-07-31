import type { McpOptions, McpResult } from '../schemas/mcp'

import { logger } from '../../utils/logger'

export const MCP_NOT_IMPLEMENTED_MESSAGE
  = 'The \'mcp\' command is not implemented yet. An MCP server for AI tools is planned for a future release.'

export async function runMcp(_options: McpOptions): Promise<McpResult> {
  logger.warn(MCP_NOT_IMPLEMENTED_MESSAGE)

  return {
    implemented: false,
    message: MCP_NOT_IMPLEMENTED_MESSAGE,
  }
}
