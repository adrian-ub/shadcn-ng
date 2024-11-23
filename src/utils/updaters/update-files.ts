import type { Config } from '../get-config'
import type { RegistryItem } from '../registry/schema'

import fs from 'node:fs'
import path, { basename } from 'node:path'
import * as p from '@clack/prompts'
import { highlighter } from '../highlighter'
import { getRegistryBaseColor, getRegistryItemFileTargetPath } from '../registry'
import { transform } from '../transformers'
import { transformImport } from '../transformers/transform-import'
import { transformTwPrefixes } from '../transformers/transform-tw-prefix'
import { transformCssVars } from './update-css-vars'

export function resolveTargetDir(
  config: Config,
  target: string,
): string {
  if (target.startsWith('~/')) {
    return path.join(config.resolvedPaths.cwd, target.replace('~/', ''))
  }
  return path.join(config.resolvedPaths.cwd, 'src', target)
}

export async function updateFiles(
  files: RegistryItem['files'],
  config: Config,
  options: {
    overwrite?: boolean
    force?: boolean
    silent?: boolean
  },
): Promise<void> {
  if (!files?.length) {
    return
  }
  options = {
    overwrite: false,
    force: false,
    silent: false,
    ...options,
  }

  const [baseColor] = await Promise.all([
    getRegistryBaseColor(config.tailwind.baseColor),
  ])

  const filesCreated = []
  const filesUpdated = []
  const filesSkipped = []

  const filesCreatedSpinner = p.spinner()
  filesCreatedSpinner.start('Updating files')

  for (const file of files) {
    if (!file.content) {
      continue
    }

    let targetDir = getRegistryItemFileTargetPath(file, config)
    const fileName = basename(file.path)
    let filePath = path.join(targetDir, fileName)

    if (file.target) {
      filePath = resolveTargetDir(config, file.target)
      targetDir = path.dirname(filePath)
    }

    const existingFile = fs.existsSync(filePath)

    if (existingFile && !options.overwrite) {
      const { overwrite } = await p.group({
        overwrite: () => p.confirm({
          message: `The file ${highlighter.info(
            fileName,
          )} already exists. Would you like to overwrite?`,
          initialValue: false,
        }),
      })

      if (!overwrite) {
        filesSkipped.push(path.relative(config.resolvedPaths.cwd, filePath))
        continue
      }
    }

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true })
    }

    const content = await transform(
      {
        filename: file.path,
        raw: file.content,
        config,
        baseColor,
      },
      // @ts-expect-error TODO: fix typecheck
      [transformImport, transformCssVars, transformTwPrefixes],
    )

    fs.writeFileSync(filePath, content, 'utf-8')
    if (existingFile) {
      filesUpdated.push(path.relative(config.resolvedPaths.cwd, filePath))
    }
    else {
      filesCreated.push(path.relative(config.resolvedPaths.cwd, filePath))
    }
  }
  const hasUpdatedFiles = filesCreated.length || filesUpdated.length
  if (!hasUpdatedFiles && !filesSkipped.length) {
    filesCreatedSpinner.message('No files updated.')
  }

  if (filesCreated.length) {
    filesCreatedSpinner.stop(
      `Created ${filesCreated.length} ${
        filesCreated.length === 1 ? 'file' : 'files'
      }:`,
    )
    if (!options.silent) {
      for (const file of filesCreated) {
        p.log.info(`  - ${file}`)
      }
    }
  }
  else {
    filesCreatedSpinner.stop()
  }

  if (filesUpdated.length) {
    filesCreatedSpinner.stop(
      `Updated ${filesUpdated.length} ${
        filesUpdated.length === 1 ? 'file' : 'files'
      }:`,
    )
    if (!options.silent) {
      for (const file of filesUpdated) {
        p.log.info(`  - ${file}`)
      }
    }
  }

  if (filesSkipped.length) {
    filesCreatedSpinner.stop(
      `Skipped ${filesSkipped.length} ${
        filesSkipped.length === 1 ? 'file' : 'files'
      }:`,
    )
    if (!options.silent) {
      for (const file of filesSkipped) {
        p.log.info(`  - ${file}`)
      }
    }
  }
}
