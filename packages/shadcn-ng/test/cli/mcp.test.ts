import { afterEach, describe, expect, it, vi } from 'vitest'

import { z } from 'zod'

import { mcp } from '../../src/cli/commands/mcp'
import { McpOptionsSchema } from '../../src/cli/schemas/mcp'
import { runMcp } from '../../src/cli/stages/run-mcp'

// ── P3.T3: mcp command — stub that reports the command is not implemented ─────

afterEach(() => {
  vi.restoreAllMocks()
})

// ── McpOptionsSchema ───────────────────────────────────────────────────────────

describe('mcpOptionsSchema', () => {
  it('parses a valid invocation with a cwd', () => {
    const parsed = McpOptionsSchema.parse({ cwd: '/tmp/project' })

    expect(parsed).toEqual({ cwd: '/tmp/project' })
  })

  it('rejects a missing cwd with a ZodError', () => {
    expect(() => McpOptionsSchema.parse({})).toThrow(z.ZodError)
  })
})

// ── runMcp ─────────────────────────────────────────────────────────────────────

describe('runMcp', () => {
  it('returns an unimplemented result with a helpful message', async () => {
    const result = await runMcp({ cwd: '/tmp/project' })

    expect(result.implemented).toBe(false)
    expect(result.message).toContain('not implemented yet')
    expect(result.message).toContain('MCP')
  })

  it('prints the not-implemented message to the console', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    await runMcp({ cwd: '/tmp/project' })

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('not implemented yet'),
    )
  })

  it('resolves without throwing so the CLI exits 0', async () => {
    await expect(runMcp({ cwd: '/tmp/project' })).resolves.toMatchObject({
      implemented: false,
    })
  })
})

// ── mcp command (commander wiring) ─────────────────────────────────────────────

describe('mcp command', () => {
  it('registers the mcp command shape', () => {
    expect(mcp.name()).toBe('mcp')
    expect(mcp.description()).toBe(
      'MCP server for AI tools (not yet implemented).',
    )

    const help = mcp.helpInformation()
    expect(help).toContain('-c, --cwd <cwd>')
  })
})
