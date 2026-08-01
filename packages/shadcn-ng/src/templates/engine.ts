import { copyFile, mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'

import ejs from 'ejs'

import { TemplateNotFoundError } from './errors'

/** Data passed to a template render. Values are interpolated via ejs. */
export type TemplateRenderData = Record<string, unknown>

/** True when the file is an ejs template that must be rendered. */
export function isTemplateFile(fileName: string): boolean {
  return fileName.endsWith('.ejs')
}

/** The target file name for a template file: `.ejs` suffix stripped. */
export function getOutputFileName(fileName: string): string {
  return isTemplateFile(fileName) ? fileName.slice(0, -'.ejs'.length) : fileName
}

/**
 * Renders ejs template content with the provided data.
 *
 * The optional filename improves ejs error messages and enables includes.
 */
export function renderTemplateContent(
  content: string,
  data: TemplateRenderData,
  options: { filename?: string } = {},
): string {
  return ejs.render(content, data, { filename: options.filename })
}

/** Recursively collects file paths relative to `dir`, sorted for determinism. */
async function walkFiles(dir: string, relativeDir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  entries.sort((a, b) => a.name.localeCompare(b.name))

  const files: string[] = []
  for (const entry of entries) {
    const relativePath = path.join(relativeDir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await walkFiles(path.join(dir, entry.name), relativePath)))
    }
    else if (entry.isFile()) {
      files.push(relativePath)
    }
  }

  return files
}

/**
 * Renders a template directory into a target directory.
 *
 * `.ejs` files are rendered with `data` (the `.ejs` suffix is stripped from
 * the output name); every other file is copied byte-identically. Nested
 * directory structure is preserved. Returns the sorted list of written
 * relative paths (with `.ejs` suffixes stripped).
 */
export async function renderTemplateDirectory(
  templateDir: string,
  targetDir: string,
  data: TemplateRenderData,
): Promise<string[]> {
  let templateStat
  try {
    templateStat = await stat(templateDir)
  }
  catch {
    throw new TemplateNotFoundError(templateDir)
  }
  if (!templateStat.isDirectory()) {
    throw new TemplateNotFoundError(templateDir)
  }

  await mkdir(targetDir, { recursive: true })

  const files = await walkFiles(templateDir, '')
  const written: string[] = []

  for (const relativePath of files) {
    const outputPath = getOutputFileName(relativePath)
    const targetPath = path.join(targetDir, outputPath)
    await mkdir(path.dirname(targetPath), { recursive: true })

    if (isTemplateFile(relativePath)) {
      const content = await readFile(path.join(templateDir, relativePath), 'utf8')
      const rendered = renderTemplateContent(content, data, {
        filename: path.join(templateDir, relativePath),
      })
      await writeFile(targetPath, rendered, 'utf8')
    }
    else {
      await copyFile(path.join(templateDir, relativePath), targetPath)
    }

    written.push(outputPath)
  }

  return written.sort()
}
