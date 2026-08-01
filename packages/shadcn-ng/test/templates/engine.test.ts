import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import {
  getOutputFileName,
  isTemplateFile,
  renderTemplateContent,
  renderTemplateDirectory,
} from '../../src/templates/engine'
import { TemplateNotFoundError } from '../../src/templates/errors'

// ── P4.T1: template engine — ejs rendering with non-ejs passthrough ─────────
//
// The engine renders `.ejs` files with the provided data and copies every
// other file through byte-identically. Rendering primitives are pure; the
// directory render walks the tree, preserves nested structure, and returns
// the sorted list of written relative paths.

let tmpDir: string

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'shadcn-ng-templates-'))
})

afterEach(async () => {
  await fs.rm(tmpDir, { recursive: true, force: true })
})

describe('isTemplateFile', () => {
  it('returns true for .ejs files', () => {
    expect(isTemplateFile('package.json.ejs')).toBe(true)
  })

  it('returns false for plain files', () => {
    expect(isTemplateFile('src/main.ts')).toBe(false)
  })
})

describe('getOutputFileName', () => {
  it('strips the .ejs suffix from template file names', () => {
    expect(getOutputFileName('package.json.ejs')).toBe('package.json')
  })

  it('strips .ejs from nested paths, keeping the directory structure', () => {
    expect(getOutputFileName('src/app/app.component.ts.ejs')).toBe(
      'src/app/app.component.ts',
    )
  })

  it('leaves non-template file names untouched', () => {
    expect(getOutputFileName('README.md')).toBe('README.md')
  })
})

describe('renderTemplateContent', () => {
  it('renders ejs interpolations with the provided data', () => {
    const content = '<h1><%= title %></h1>'
    expect(renderTemplateContent(content, { title: 'ShadCN NG' })).toBe(
      '<h1>ShadCN NG</h1>',
    )
  })

  it('renders different data into the same template', () => {
    const content = '{"name":"<%= name %>"}'
    expect(renderTemplateContent(content, { name: 'my-app' })).toBe(
      '{"name":"my-app"}',
    )
  })

  it('propagates render errors when the data does not satisfy the template', () => {
    expect(() => renderTemplateContent('<%= missing %>', {})).toThrow(
      ReferenceError,
    )
  })
})

describe('renderTemplateDirectory', () => {
  // Fixture: one .ejs file, one nested .ejs file, one plain file, one empty
  // file — exercises rendering, nested structure, and passthrough together.
  async function writeFixture(dir: string): Promise<void> {
    await fs.mkdir(path.join(dir, 'src', 'app'), { recursive: true })
    await fs.writeFile(
      path.join(dir, 'package.json.ejs'),
      '{"name":"<%= name %>"}\n',
    )
    await fs.writeFile(
      path.join(dir, 'src', 'app', 'app.component.ts'),
      'export const app = true\n',
    )
    await fs.writeFile(path.join(dir, 'README.md.ejs'), '# <%= name %>\n')
    await fs.writeFile(path.join(dir, '.gitkeep'), '')
  }

  it('renders .ejs files with data, copies plain files, and preserves structure', async () => {
    const templateDir = path.join(tmpDir, 'template')
    const targetDir = path.join(tmpDir, 'target')
    await writeFixture(templateDir)

    const written = await renderTemplateDirectory(templateDir, targetDir, {
      name: 'my-app',
    })

    expect(written).toEqual([
      '.gitkeep',
      'README.md',
      'package.json',
      'src/app/app.component.ts',
    ])

    await expect(
      fs.readFile(path.join(targetDir, 'package.json'), 'utf8'),
    ).resolves.toBe('{"name":"my-app"}\n')
    await expect(
      fs.readFile(path.join(targetDir, 'README.md'), 'utf8'),
    ).resolves.toBe('# my-app\n')
    await expect(
      fs.readFile(path.join(targetDir, 'src', 'app', 'app.component.ts'), 'utf8'),
    ).resolves.toBe('export const app = true\n')
    await expect(fs.readFile(path.join(targetDir, '.gitkeep'), 'utf8')).resolves.toBe('')
  })

  it('creates the target directory and renders an empty template to an empty result', async () => {
    const templateDir = path.join(tmpDir, 'empty-template')
    const targetDir = path.join(tmpDir, 'empty-target')
    await fs.mkdir(templateDir, { recursive: true })

    const written = await renderTemplateDirectory(templateDir, targetDir, {})

    expect(written).toEqual([])
    await expect(fs.stat(targetDir)).resolves.toBeTruthy()
  })

  it('rejects with TemplateNotFoundError when the template directory is missing', async () => {
    const missing = path.join(tmpDir, 'nope')

    await expect(
      renderTemplateDirectory(missing, path.join(tmpDir, 'target'), {}),
    ).rejects.toBeInstanceOf(TemplateNotFoundError)
  })

  it('rejects with TemplateNotFoundError when the path is not a directory', async () => {
    const file = path.join(tmpDir, 'plain.txt')
    await fs.writeFile(file, 'not a dir')

    await expect(
      renderTemplateDirectory(file, path.join(tmpDir, 'target'), {}),
    ).rejects.toBeInstanceOf(TemplateNotFoundError)
  })
})
