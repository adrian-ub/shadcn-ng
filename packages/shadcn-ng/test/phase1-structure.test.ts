import { describe, expect, it } from 'vitest'
import { existsSync, readdirSync, statSync } from 'node:fs'
import { resolve } from 'node:path'

const projectRoot = resolve(import.meta.dirname, '../..')

describe('P1.T1: Folder restructure — apps/v4/registry/bases/', () => {
  const basesDir = resolve(projectRoot, 'apps/v4/registry/bases')

  it('creates bases directory at the expected path', () => {
    expect(existsSync(basesDir)).toBe(true)
  })

  it('creates README.md explaining the multi-base pattern', () => {
    expect(existsSync(resolve(basesDir, 'README.md'))).toBe(true)
  })

  describe('radix-ng base', () => {
    const radixDir = resolve(basesDir, 'radix-ng')

    it('creates radix-ng base directory', () => {
      expect(existsSync(radixDir)).toBe(true)
    })

    it('creates registry.ts base manifest', () => {
      expect(existsSync(resolve(radixDir, 'registry.ts'))).toBe(true)
    })

    const requiredDirs = [
      'ui', 'lib', 'components', 'blocks', 'examples', 'hooks', 'internal',
    ]

    for (const dir of requiredDirs) {
      it(`creates ${dir}/ subdirectory`, () => {
        const fullPath = resolve(radixDir, dir)
        expect(existsSync(fullPath)).toBe(true)
        expect(statSync(fullPath).isDirectory()).toBe(true)
      })
    }
  })

  it('reads ui/ directory with expected component files', () => {
    // NOTE: strict test — if files aren't moved yet, this validates fresh start
    // If new-york-v4 still exists, failing proves this is a proper structural change
    const uiDir = resolve(basesDir, 'radix-ng/ui')
    const files = readdirSync(uiDir).filter(f => f.endsWith('.ts'))
    expect(files.length).toBeGreaterThanOrEqual(20) // 23 components expected
    expect(files).toContain('button.ts')
    expect(files).toContain('dialog.ts')
    expect(files).toContain('accordion.ts')
  })
})

describe('P1.T1: templates directory', () => {
  it('has templates/ at root ready for Phase 4', () => {
    const templatesDir = resolve(projectRoot, 'templates')
    expect(existsSync(templatesDir)).toBe(true)
    expect(statSync(templatesDir).isDirectory()).toBe(true)
  })
})
