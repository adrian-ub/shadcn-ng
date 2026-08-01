import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import {
  createTemplate,
  createTemplateFrom,
  initializeTemplate,
  TEMPLATE_MANIFEST_FILE,
} from '../../src/templates/create-template'
import { TemplateNotFoundError } from '../../src/templates/errors'

// ── P4.T1: create-template — manifest factory + template directory helpers ──
//
// createTemplate mirrors the upstream descriptor factory intent: a partial
// config is completed with defaults (title / defaultProjectName). The helpers
// initialize a variant directory with the expected structure (a template.json
// manifest) or scaffold a new variant from an existing template directory.

let tmpDir: string

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'shadcn-ng-templates-'))
})

afterEach(async () => {
  await fs.rm(tmpDir, { recursive: true, force: true })
})

describe('createTemplate', () => {
  it('fills title and defaultProjectName defaults from the name', () => {
    expect(createTemplate({ name: 'standalone' })).toEqual({
      name: 'standalone',
      title: 'standalone',
      defaultProjectName: 'standalone',
    })
  })

  it('preserves explicit config values', () => {
    expect(
      createTemplate({
        name: 'ssr',
        title: 'Angular SSR',
        description: 'SSR scaffold',
        defaultProjectName: 'ssr-app',
      }),
    ).toEqual({
      name: 'ssr',
      title: 'Angular SSR',
      description: 'SSR scaffold',
      defaultProjectName: 'ssr-app',
    })
  })
})

describe('initializeTemplate', () => {
  it('creates a variant directory under custom/ with a template.json manifest', async () => {
    const dir = await initializeTemplate(tmpDir, 'my-variant')

    expect(dir).toBe(path.join(tmpDir, 'custom', 'my-variant'))

    const manifest = JSON.parse(
      await fs.readFile(path.join(dir, TEMPLATE_MANIFEST_FILE), 'utf8'),
    )
    expect(manifest).toEqual({
      name: 'my-variant',
      title: 'my-variant',
      defaultProjectName: 'my-variant',
    })
  })

  it('honors a category override', async () => {
    const dir = await initializeTemplate(tmpDir, 'ssr', {
      category: 'angular',
    })

    expect(dir).toBe(path.join(tmpDir, 'angular', 'ssr'))
  })

  it('writes a manifest with explicit config overrides', async () => {
    const dir = await initializeTemplate(tmpDir, 'custom-app', {
      config: { name: 'custom-app', title: 'Custom App' },
    })

    const manifest = JSON.parse(
      await fs.readFile(path.join(dir, TEMPLATE_MANIFEST_FILE), 'utf8'),
    )
    expect(manifest.title).toBe('Custom App')
    expect(manifest.defaultProjectName).toBe('custom-app')
  })
})

describe('createTemplateFrom', () => {
  it('scaffolds a new template directory from an existing one', async () => {
    const source = path.join(tmpDir, 'source')
    await fs.mkdir(path.join(source, 'src'), { recursive: true })
    await fs.writeFile(path.join(source, 'package.json.ejs'), '{"name":"x"}\n')
    await fs.writeFile(
      path.join(source, 'src', 'main.ts'),
      'export const main = true\n',
    )
    const target = path.join(tmpDir, 'target')

    const dir = await createTemplateFrom(source, target)

    expect(dir).toBe(target)
    await expect(
      fs.readFile(path.join(target, 'package.json.ejs'), 'utf8'),
    ).resolves.toBe('{"name":"x"}\n')
    await expect(
      fs.readFile(path.join(target, 'src', 'main.ts'), 'utf8'),
    ).resolves.toBe('export const main = true\n')
  })

  it('rejects with TemplateNotFoundError when the source is missing', async () => {
    await expect(
      createTemplateFrom(path.join(tmpDir, 'nope'), path.join(tmpDir, 'target')),
    ).rejects.toBeInstanceOf(TemplateNotFoundError)
  })
})
