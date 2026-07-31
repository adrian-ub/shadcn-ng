import type { ComponentScan, RegistryManifest } from '../../src/registry/builder'
import { promises as fs } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {

  RegistryBuilder,

  writeManifest,
} from '../../src/registry/builder'
import { SchemaError } from '../../src/registry/errors'
import { registrySchema } from '../../src/registry/schemas'

// ── P2.T5a: dir scanner → index generator → manifest writer ────────────────

describe('p2.T5a: RegistryBuilder.scan', () => {
  let tmpDir: string

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(tmpdir(), 'shadcn-ng-builder-'))
    // Minimal radix-ng-style base layout: ui/, lib/, components/, hooks/, blocks/.
    await fs.mkdir(path.join(tmpDir, 'ui'), { recursive: true })
    await fs.mkdir(path.join(tmpDir, 'lib'), { recursive: true })
    await fs.mkdir(path.join(tmpDir, 'components'), { recursive: true })
    await fs.mkdir(path.join(tmpDir, 'hooks'), { recursive: true })
    await fs.mkdir(path.join(tmpDir, 'blocks'), { recursive: true })
    await fs.writeFile(path.join(tmpDir, 'ui', 'button.ts'), 'export const button = 1')
    await fs.writeFile(path.join(tmpDir, 'ui', 'alert-dialog.ts'), 'export const x = 1')
    await fs.writeFile(path.join(tmpDir, 'ui', 'README.md'), 'docs only')
    await fs.writeFile(path.join(tmpDir, 'lib', 'utils.ts'), 'export const cn = 1')
    await fs.writeFile(path.join(tmpDir, 'components', 'example.ts'), 'export const e = 1')
    await fs.writeFile(path.join(tmpDir, 'hooks', 'use-mobile.ts'), 'export const h = 1')
    await fs.writeFile(path.join(tmpDir, 'blocks', 'marketing.ts'), 'export const b = 1')
  })

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true })
  })

  it('maps ui/ files to registry:ui entries with extension-free names', async () => {
    const builder = new RegistryBuilder()
    const scan = await builder.scan(tmpDir)

    const uiEntries = scan.items.filter(item => item.type === 'registry:ui')
    expect(uiEntries.map(item => item.name).sort()).toEqual([
      'alert-dialog',
      'button',
    ])
    expect(uiEntries[0]!.files).toEqual([
      { path: 'ui/alert-dialog.ts', type: 'registry:ui' },
    ])
  })

  it('maps lib/, components/, hooks/, and blocks/ dirs to their item types', async () => {
    const builder = new RegistryBuilder()
    const scan = await builder.scan(tmpDir)

    expect(scan.items).toContainEqual({
      name: 'utils',
      type: 'registry:lib',
      files: [{ path: 'lib/utils.ts', type: 'registry:lib' }],
    })
    expect(scan.items).toContainEqual({
      name: 'example',
      type: 'registry:component',
      files: [{ path: 'components/example.ts', type: 'registry:component' }],
    })
    expect(scan.items).toContainEqual({
      name: 'use-mobile',
      type: 'registry:lib',
      files: [{ path: 'hooks/use-mobile.ts', type: 'registry:lib' }],
    })
    expect(scan.items).toContainEqual({
      name: 'marketing',
      type: 'registry:block',
      files: [{ path: 'blocks/marketing.ts', type: 'registry:block' }],
    })
  })

  it('ignores non-source files like README.md', async () => {
    const builder = new RegistryBuilder()
    const scan = await builder.scan(tmpDir)

    const uiNames = scan.items
      .filter(item => item.type === 'registry:ui')
      .map(item => item.name)
    expect(uiNames).toEqual(['alert-dialog', 'button'])
    expect(uiNames).not.toContain('README')
  })

  it('sorts items deterministically by name', async () => {
    const builder = new RegistryBuilder()
    const scan = await builder.scan(tmpDir)

    const names = scan.items.map(item => item.name)
    expect(names).toEqual([...names].sort())
  })

  it('records the scanned base path on the scan result', async () => {
    const builder = new RegistryBuilder()
    const scan = await builder.scan(tmpDir)

    expect(scan.basePath).toBe(tmpDir)
  })

  it('returns no items when no layout dirs exist (with a valid non-empty companion)', async () => {
    const emptyDir = await fs.mkdtemp(path.join(tmpdir(), 'shadcn-ng-empty-'))
    try {
      const builder = new RegistryBuilder()
      const scan = await builder.scan(emptyDir)
      expect(scan.items).toEqual([])
    }
    finally {
      await fs.rm(emptyDir, { recursive: true, force: true })
    }
  })

  it('throws a descriptive error when the base path does not exist', async () => {
    const builder = new RegistryBuilder()
    const missing = path.join(tmpDir, 'does-not-exist')

    await expect(builder.scan(missing)).rejects.toThrow(/not found/i)
  })
})

describe('p2.T5a: RegistryBuilder.buildManifest', () => {
  let tmpDir: string

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(tmpdir(), 'shadcn-ng-manifest-'))
    await fs.mkdir(path.join(tmpDir, 'ui'), { recursive: true })
    await fs.writeFile(path.join(tmpDir, 'ui', 'button.ts'), 'export const button = 1')
  })

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true })
  })

  it('builds a valid registry manifest from a scan', async () => {
    const builder = new RegistryBuilder()
    const scan = await builder.scan(tmpDir)
    const manifest = await builder.buildManifest(scan, {
      name: 'radix-ng',
      homepage: 'https://github.com/adrian-ub/shadcn-ng',
    })

    expect(registrySchema.safeParse(manifest).success).toBe(true)
    expect(manifest.name).toBe('radix-ng')
    expect(manifest.homepage).toBe('https://github.com/adrian-ub/shadcn-ng')
    expect(manifest.items).toHaveLength(1)
    expect(manifest.items[0]).toMatchObject({
      name: 'button',
      type: 'registry:ui',
    })
  })

  it('defaults the manifest name to the scanned base directory name', async () => {
    const builder = new RegistryBuilder()
    const scan = await builder.scan(tmpDir)
    const manifest = await builder.buildManifest(scan)

    expect(manifest.name).toBe(path.basename(tmpDir))
    expect(manifest.homepage).toBe('')
  })

  it('throws SchemaError when a scanned entry is invalid', async () => {
    const builder = new RegistryBuilder()
    const invalidScan: ComponentScan = {
      basePath: tmpDir,
      items: [{ name: '', type: 'registry:ui', files: [] }],
    }

    await expect(builder.buildManifest(invalidScan)).rejects.toThrow(SchemaError)
  })

  it('throws SchemaError when two layout dirs produce the same item name', async () => {
    await fs.mkdir(path.join(tmpDir, 'components'), { recursive: true })
    await fs.writeFile(path.join(tmpDir, 'components', 'button.ts'), 'export const b = 1')

    const builder = new RegistryBuilder()
    const scan = await builder.scan(tmpDir)

    try {
      await builder.buildManifest(scan)
      expect.unreachable('Should have thrown')
    }
    catch (error) {
      expect(error).toBeInstanceOf(SchemaError)
      if (error instanceof SchemaError) {
        expect(error.message).toContain('button')
        expect(error.message).toMatch(/duplicate/i)
      }
    }
  })
})

describe('p2.T5a: writeManifest', () => {
  it('writes a manifest as registry.json that round-trips through JSON.parse', async () => {
    const dir = await fs.mkdtemp(path.join(tmpdir(), 'shadcn-ng-write-'))
    try {
      const manifest: RegistryManifest = {
        name: 'radix-ng',
        homepage: 'https://github.com/adrian-ub/shadcn-ng',
        items: [
          {
            name: 'button',
            type: 'registry:ui',
            files: [{ path: 'ui/button.ts', type: 'registry:ui' }],
          },
        ],
      }
      const outputPath = path.join(dir, 'registry.json')

      await writeManifest(manifest, outputPath)

      const written = JSON.parse(await fs.readFile(outputPath, 'utf-8'))
      expect(written).toEqual(manifest)
    }
    finally {
      await fs.rm(dir, { recursive: true, force: true })
    }
  })

  it('creates nested output directories', async () => {
    const dir = await fs.mkdtemp(path.join(tmpdir(), 'shadcn-ng-write-'))
    try {
      const manifest: RegistryManifest = {
        name: 'radix-ng',
        homepage: '',
        items: [],
      }
      const outputPath = path.join(dir, 'styles', 'new-york', 'registry.json')

      await writeManifest(manifest, outputPath)

      const written = JSON.parse(await fs.readFile(outputPath, 'utf-8'))
      expect(written).toEqual(manifest)
    }
    finally {
      await fs.rm(dir, { recursive: true, force: true })
    }
  })
})
