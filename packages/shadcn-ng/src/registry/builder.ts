import type { Registry, RegistryItemType } from './schemas'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { SchemaError } from './errors'
import {
  validateRegistryItem,
  validateRegistryManifest,
} from './validator'

// ── Constants ───────────────────────────────────────────────────────────────

/**
 * Source file extensions the scanner treats as component entries.
 * Angular components are TypeScript (`.ts`); there is no `.tsx` in Angular.
 * Templates (`.html`) and styles (`.css`) belong to the component but are
 * not separate entries — the registry item's `files` must list them
 * explicitly. Non-source files (e.g. `README.md`, `*.json`) are ignored.
 */
export const SOURCE_EXTENSIONS = ['.ts'] as const

/**
 * Maps a base layout directory name to the registry item type its files
 * represent. `hooks/` maps to `registry:lib` because the schema enum does
 * not include upstream v4's `registry:hook` type yet.
 */
const LAYOUT_DIR_TO_TYPE: Record<string, RegistryItemType> = {
  ui: 'registry:ui',
  lib: 'registry:lib',
  components: 'registry:component',
  hooks: 'registry:lib',
  blocks: 'registry:block',
  internal: 'registry:internal',
  examples: 'registry:example',
}

// ── Types ───────────────────────────────────────────────────────────────────

/**
 * A component entry derived from one source file in a base layout directory.
 */
export interface ComponentEntry {
  /** Component name derived from the file name without its extension. */
  name: string
  /** Registry item type inferred from the layout directory. */
  type: RegistryItemType
  /** Files that make up the component, relative to the scanned base path. */
  files: Array<{ path: string, type: RegistryItemType }>
}

/**
 * The result of scanning a registry base directory: the scanned path plus
 * the component entries derived from its layout directories.
 */
export interface ComponentScan {
  /** The base path that was scanned. */
  basePath: string
  /** Component entries in deterministic (name-sorted) order. */
  items: ComponentEntry[]
}

/**
 * A validated registry manifest (`{ name, homepage, items }`).
 */
export type RegistryManifest = Registry

export interface BuildManifestOptions {
  /** Manifest name. Defaults to the scanned base directory name. */
  name?: string
  /** Manifest homepage. Defaults to an empty string. */
  homepage?: string
}

/**
 * The registry builder contract: scan a base directory into component
 * entries, then build a validated registry manifest from the scan.
 */
/* eslint-disable ts/no-unsafe-declaration-merging, ts/method-signature-style -- Design contract requires interface RegistryBuilder + merged class (same pattern as resolver.ts); function-property form would collide with the class methods and break tsc. */
export interface RegistryBuilder {
  scan(basePath: string): Promise<ComponentScan>
  buildManifest(
    scan: ComponentScan,
    options?: BuildManifestOptions,
  ): Promise<RegistryManifest>
}
/* eslint-enable ts/no-unsafe-declaration-merging, ts/method-signature-style */

// ── RegistryBuilder ─────────────────────────────────────────────────────────

/**
 * Scans a registry base directory layout (`/ui`, `/lib`, `/components`,
 * `/hooks`, `/blocks`, ...) into component entries and builds a zod-validated
 * registry manifest.
 *
 * Each source file in a layout directory becomes one component entry whose
 * type is inferred from the directory name (e.g. `ui/button.ts` →
 * `registry:ui`). Files with unsupported extensions are ignored.
 */
// eslint-disable-next-line ts/no-unsafe-declaration-merging -- Merged class implementing the interface above (design contract; same pattern as resolver.ts).
export class RegistryBuilder implements RegistryBuilder {
  /**
   * Scans the layout directories under `basePath`.
   *
   * @throws {Error} When `basePath` does not exist or cannot be read.
   */
  async scan(basePath: string): Promise<ComponentScan> {
    let entries: Awaited<ReturnType<typeof fs.readdir>>
    try {
      entries = await fs.readdir(basePath, { withFileTypes: true })
    }
    catch (error) {
      throw new Error(
        `Registry base directory not found: ${basePath}`,
        { cause: error },
      )
    }

    const items: ComponentEntry[] = []

    for (const entry of entries) {
      const itemType = LAYOUT_DIR_TO_TYPE[entry.name]
      if (!entry.isDirectory() || !itemType) {
        continue
      }

      const dirPath = path.join(basePath, entry.name)
      const files = await fs.readdir(dirPath, { withFileTypes: true })

      for (const file of files) {
        if (!file.isFile() || !hasSourceExtension(file.name)) {
          continue
        }

        items.push({
          name: stripExtension(file.name),
          type: itemType,
          files: [{ path: toPosixPath(path.join(entry.name, file.name)), type: itemType }],
        })
      }
    }

    return {
      basePath,
      items: items.sort((a, b) => a.name.localeCompare(b.name)),
    }
  }

  /**
   * Builds a validated registry manifest from a scan.
   *
   * Every scanned entry is zod-validated as a {@link RegistryItem} and the
   * assembled manifest as a whole. Duplicate component names across layout
   * directories fail the build.
   *
   * @throws {SchemaError} When an entry or the assembled manifest fails
   *   validation, or when two entries share the same name.
   */
  async buildManifest(
    scan: ComponentScan,
    options: BuildManifestOptions = {},
  ): Promise<RegistryManifest> {
    const duplicateNames = findDuplicateNames(scan.items)
    if (duplicateNames.length > 0) {
      throw new SchemaError(
        `Duplicate registry item name${duplicateNames.length > 1 ? 's' : ''} `
        + `${duplicateNames.map(name => `"${name}"`).join(', ')} across layout `
        + 'directories. Each component name must be unique in the manifest.',
      )
    }

    const items = scan.items.map(entry =>
      validateRegistryItem(entry, entry.name),
    )

    return validateRegistryManifest({
      name: options.name ?? path.basename(scan.basePath),
      homepage: options.homepage ?? '',
      items,
    })
  }
}

// ── Manifest writer ─────────────────────────────────────────────────────────

/**
 * Writes a registry manifest to disk as pretty-printed JSON.
 *
 * Creates the parent directories of `filePath` when they do not exist.
 *
 * @throws {Error} When the file cannot be written.
 */
export async function writeManifest(
  manifest: RegistryManifest,
  filePath: string,
): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, `${JSON.stringify(manifest, null, 2)}\n`)
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function hasSourceExtension(fileName: string): boolean {
  return SOURCE_EXTENSIONS.some(extension => fileName.endsWith(extension))
}

function stripExtension(fileName: string): string {
  const extension = path.extname(fileName)
  return extension ? fileName.slice(0, -extension.length) : fileName
}

function toPosixPath(filePath: string): string {
  return filePath.split(path.sep).join('/')
}

function findDuplicateNames(items: ComponentEntry[]): string[] {
  const seen = new Set<string>()
  const duplicates = new Set<string>()

  for (const item of items) {
    if (seen.has(item.name)) {
      duplicates.add(item.name)
    }
    else {
      seen.add(item.name)
    }
  }

  return Array.from(duplicates).sort()
}
