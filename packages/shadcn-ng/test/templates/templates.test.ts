import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import {
  AVAILABLE_TEMPLATES,
  DEFAULT_TEMPLATE,
} from '../../src/cli/stages/resolve-template'
import { UnknownTemplateError } from '../../src/templates/errors'
import {
  getTemplateVariant,
  renderTemplate,
  resolveTemplateDir,
  resolveTemplatesRoot,
  scanTemplates,
  TEMPLATE_VARIANTS,
} from '../../src/templates/templates'

// ── P4.T1: template location — variants, scanning, and variant-aware render ─
//
// Variants map a name ('standalone' | 'ssr' | 'nx-monorepo') to a directory
// relative to the templates root (e.g. 'angular/standalone'). The names MUST
// stay aligned with the init command's AVAILABLE_TEMPLATES (P3.T5); the
// alignment test below enforces that. scanTemplates discovers variants from
// the templates root directory, so P4.T2/P4.T3 can add the 10 variants
// without engine changes.

let tmpDir: string

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'shadcn-ng-templates-'))
})

afterEach(async () => {
  await fs.rm(tmpDir, { recursive: true, force: true })
})

describe('resolveTemplatesRoot', () => {
  it('resolves the templates root under the given cwd', () => {
    expect(resolveTemplatesRoot('/tmp/project')).toBe('/tmp/project/templates')
  })
})

describe('scanTemplates', () => {
  // Fixture mirrors the design layout: variants live one level under a
  // category directory (templates/angular/... + templates/custom/...).
  async function writeVariant(
    root: string,
    category: string,
    name: string,
  ): Promise<void> {
    await fs.mkdir(path.join(root, category, name), { recursive: true })
    await fs.writeFile(
      path.join(root, category, name, 'package.json.ejs'),
      '{"name":"<%= name %>"}\n',
    )
  }

  it('discovers variants under category directories', async () => {
    await writeVariant(tmpDir, 'angular', 'standalone')
    await writeVariant(tmpDir, 'angular', 'ssr')
    await writeVariant(tmpDir, 'custom', 'foo')

    await expect(scanTemplates(tmpDir)).resolves.toEqual([
      // Alphabetical order within the angular category: "ssr" < "standalone".
      { name: 'ssr', dir: 'angular/ssr' },
      { name: 'standalone', dir: 'angular/standalone' },
      { name: 'foo', dir: 'custom/foo' },
    ])
  })

  it('returns an empty list when the templates root does not exist', async () => {
    await expect(scanTemplates(path.join(tmpDir, 'nope'))).resolves.toEqual([])
  })

  it('returns an empty list for an empty templates root', async () => {
    await expect(scanTemplates(tmpDir)).resolves.toEqual([])
  })
})

describe('getTemplateVariant', () => {
  it('resolves a known variant to its relative template directory', () => {
    expect(getTemplateVariant('standalone')).toEqual({
      name: 'standalone',
      dir: 'angular/standalone',
    })
  })

  it('rejects an unknown variant listing the available templates', () => {
    expect(() => getTemplateVariant('bogus')).toThrow(UnknownTemplateError)
    expect(() => getTemplateVariant('bogus')).toThrow(
      'Unknown template "bogus". Available templates: standalone, ssr, nx-monorepo.',
    )
  })
})

describe('resolveTemplateDir', () => {
  it('joins the templates root with the variant directory', () => {
    expect(resolveTemplateDir(tmpDir, 'ssr')).toBe(
      path.join(tmpDir, 'angular', 'ssr'),
    )
  })

  it('rejects unknown variants', () => {
    expect(() => resolveTemplateDir(tmpDir, 'bogus')).toThrow(
      UnknownTemplateError,
    )
  })
})

describe('variant alignment with the init command (P3.T5)', () => {
  it('engine variant names match AVAILABLE_TEMPLATES from resolve-template', () => {
    expect(TEMPLATE_VARIANTS.map(variant => variant.name)).toEqual([
      ...AVAILABLE_TEMPLATES,
    ])
  })

  it('the default template is a known engine variant', () => {
    expect(getTemplateVariant(DEFAULT_TEMPLATE).name).toBe('standalone')
  })
})

describe('renderTemplate', () => {
  it('resolves a variant and renders it into the target directory', async () => {
    await fs.mkdir(path.join(tmpDir, 'angular', 'standalone'), {
      recursive: true,
    })
    await fs.writeFile(
      path.join(tmpDir, 'angular', 'standalone', 'package.json.ejs'),
      '{"name":"<%= name %>"}\n',
    )
    const targetDir = path.join(tmpDir, 'project')

    const written = await renderTemplate(
      tmpDir,
      'standalone',
      targetDir,
      { name: 'my-app' },
    )

    expect(written).toEqual(['package.json'])
    await expect(
      fs.readFile(path.join(targetDir, 'package.json'), 'utf8'),
    ).resolves.toBe('{"name":"my-app"}\n')
  })

  it('rejects an unknown variant before any filesystem work', async () => {
    await expect(
      renderTemplate(tmpDir, 'bogus', path.join(tmpDir, 'project'), {}),
    ).rejects.toBeInstanceOf(UnknownTemplateError)
  })
})
