import { cp, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { TemplateNotFoundError } from './errors'

/** Partial template config accepted by `createTemplate`. */
export interface TemplateConfigInput {
  name: string
  title?: string
  description?: string
  defaultProjectName?: string
}

/** A complete template config with defaults filled in. */
export interface TemplateConfig {
  name: string
  title: string
  description?: string
  defaultProjectName: string
}

/**
 * Completes a partial template config with defaults, mirroring the upstream
 * `createTemplate` descriptor factory intent: `title` and
 * `defaultProjectName` fall back to the variant name.
 */
export function createTemplate(config: TemplateConfigInput): TemplateConfig {
  return {
    name: config.name,
    title: config.title ?? config.name,
    description: config.description,
    defaultProjectName: config.defaultProjectName ?? config.name,
  }
}

/** Manifest file written into every initialized template directory. */
export const TEMPLATE_MANIFEST_FILE = 'template.json'

/**
 * Initializes a new template variant directory with the expected structure:
 * `<templatesRoot>/<category>/<name>/` containing a `template.json` manifest.
 * Defaults to the `custom` category; P4.T2/P4.T3 fill in the actual scaffold
 * files. Returns the created directory.
 */
export async function initializeTemplate(
  templatesRoot: string,
  name: string,
  options: { category?: string, config?: TemplateConfigInput } = {},
): Promise<string> {
  const category = options.category ?? 'custom'
  const templateDir = path.join(templatesRoot, category, name)
  await mkdir(templateDir, { recursive: true })

  const manifest = createTemplate(options.config ?? { name })
  await writeFile(
    path.join(templateDir, TEMPLATE_MANIFEST_FILE),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8',
  )

  return templateDir
}

/**
 * Scaffolds a new template directory from an existing one by copying its
 * contents recursively (rendering is deliberately not applied — the copy is a
 * raw scaffold source). Returns the target directory.
 */
export async function createTemplateFrom(
  sourceDir: string,
  targetDir: string,
): Promise<string> {
  try {
    await cp(sourceDir, targetDir, { recursive: true })
  }
  catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      throw new TemplateNotFoundError(sourceDir)
    }

    throw error
  }

  return targetDir
}
