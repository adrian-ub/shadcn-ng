import type { TemplateRenderData } from './engine'
import { readdir } from 'node:fs/promises'

import path from 'node:path'
import { renderTemplateDirectory } from './engine'
import { UnknownTemplateError } from './errors'

/** A template variant: a stable name mapped to a directory under the templates root. */
export interface TemplateVariant {
  name: string
  /** Path relative to the templates root, e.g. `angular/standalone`. */
  dir: string
}

/**
 * The variants the engine can render. Names MUST stay aligned with the init
 * command's `AVAILABLE_TEMPLATES` (P3.T5); the alignment test enforces it.
 * P4.T2/P4.T3 add the remaining variants (templates/custom/) to this list.
 */
export const TEMPLATE_VARIANTS: TemplateVariant[] = [
  { name: 'standalone', dir: 'angular/standalone' },
  { name: 'ssr', dir: 'angular/ssr' },
  { name: 'nx-monorepo', dir: 'angular/nx-monorepo' },
]

/** Resolves the templates root for a working directory (repo-root `templates/`). */
export function resolveTemplatesRoot(cwd: string): string {
  return path.resolve(cwd, 'templates')
}

/** Resolves a variant by name, rejecting unknown names with the available list. */
export function getTemplateVariant(
  name: string,
  variants: TemplateVariant[] = TEMPLATE_VARIANTS,
): TemplateVariant {
  const variant = variants.find(candidate => candidate.name === name)
  if (!variant) {
    throw new UnknownTemplateError(
      name,
      variants.map(candidate => candidate.name),
    )
  }

  return variant
}

/**
 * Discovers variants from the templates root directory.
 *
 * Variants live one level under a category directory (`angular/`, `custom/`),
 * so a variant's relative directory is `<category>/<name>`. A missing or
 * empty templates root yields an empty list — P4.T2/P4.T3 create the 10
 * variant directories without engine changes.
 */
export async function scanTemplates(templatesRoot: string): Promise<TemplateVariant[]> {
  let categories
  try {
    categories = await readdir(templatesRoot, { withFileTypes: true })
  }
  catch {
    return []
  }

  const variants: TemplateVariant[] = []
  const categoryDirs = categories
    .filter(entry => entry.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name))

  for (const category of categoryDirs) {
    const categoryPath = path.join(templatesRoot, category.name)
    let entries
    try {
      entries = await readdir(categoryPath, { withFileTypes: true })
    }
    catch {
      continue
    }

    const variantDirs = entries
      .filter(entry => entry.isDirectory())
      .sort((a, b) => a.name.localeCompare(b.name))

    for (const variant of variantDirs) {
      variants.push({ name: variant.name, dir: `${category.name}/${variant.name}` })
    }
  }

  return variants
}

/** Resolves the absolute template directory for a variant. */
export function resolveTemplateDir(
  templatesRoot: string,
  name: string,
  variants: TemplateVariant[] = TEMPLATE_VARIANTS,
): string {
  return path.join(templatesRoot, getTemplateVariant(name, variants).dir)
}

/**
 * Renders a named variant into a target directory.
 *
 * Convenience over `renderTemplateDirectory`: resolves the variant directory
 * from the templates root, then renders `.ejs` files with `data` and copies
 * everything else as-is. Unknown names reject before any filesystem work.
 */
export async function renderTemplate(
  templatesRoot: string,
  name: string,
  targetDir: string,
  data: TemplateRenderData,
  variants: TemplateVariant[] = TEMPLATE_VARIANTS,
): Promise<string[]> {
  const templateDir = resolveTemplateDir(templatesRoot, name, variants)

  return renderTemplateDirectory(templateDir, targetDir, data)
}
