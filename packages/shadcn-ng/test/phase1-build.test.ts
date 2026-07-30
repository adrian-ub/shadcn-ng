import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const packageRoot = resolve(import.meta.dirname, '..')       // packages/shadcn-ng/
const projectRoot = resolve(import.meta.dirname, '../..')    // repo root

describe('P1.T2: Build migration — tsdown config', () => {
  it('has tsdown.config.ts in the package with tsdown import', () => {
    const configPath = resolve(packageRoot, 'tsdown.config.ts')
    expect(existsSync(configPath)).toBe(true)

    const content = readFileSync(configPath, 'utf-8')
    expect(content).toContain('tsdown')
    expect(content).not.toContain('unbuild')
  })

  it('has tsdown available in the package devDependencies', () => {
    const pkgPath = resolve(packageRoot, 'package.json')
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))

    const hasTsdown = pkg.devDependencies?.tsdown !== undefined
    expect(hasTsdown).toBe(true)

    // unbuild should no longer be referenced
    expect(pkg.devDependencies?.unbuild).toBeUndefined()
  })
})

describe('P1.T3: turbo.json pipeline', () => {
  it('creates turbo.json at root', () => {
    const turboPath = resolve(projectRoot, 'turbo.json')
    expect(existsSync(turboPath)).toBe(true)

    const content = JSON.parse(readFileSync(turboPath, 'utf-8'))
    expect(content.$schema).toContain('turbo.build/schema.json')
    expect(content.tasks).toBeDefined()
  })

  it('defines build task with outputs', () => {
    const turboPath = resolve(projectRoot, 'turbo.json')
    const content = JSON.parse(readFileSync(turboPath, 'utf-8'))

    expect(content.tasks.build).toBeDefined()
    expect(content.tasks.build.outputs).toBeDefined()
    expect(Array.isArray(content.tasks.build.outputs)).toBe(true)
  })

  it('defines lint task with cache disabled', () => {
    const turboPath = resolve(projectRoot, 'turbo.json')
    const content = JSON.parse(readFileSync(turboPath, 'utf-8'))

    expect(content.tasks.lint).toBeDefined()
    expect(content.tasks.lint.cache).toBe(false)
  })

  it('defines test task', () => {
    const turboPath = resolve(projectRoot, 'turbo.json')
    const content = JSON.parse(readFileSync(turboPath, 'utf-8'))

    expect(content.tasks.test).toBeDefined()
  })

  it('has packageManager updated to pnpm@10', () => {
    const pkgPath = resolve(projectRoot, 'package.json')
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
    expect(pkg.packageManager).toMatch(/^pnpm@10\./)
  })
})
