import type * as v from 'valibot'

import type { Config, RegistryItem, RegistryItemFileSchema } from '../../../registry'

import { existsSync, promises as fs } from 'node:fs'
import path, { basename } from 'node:path'

import * as p from '@clack/prompts'
import c from 'picocolors'

import { getRegistryBaseColor } from '../../registry'
import { verifyIsCancelPrompt } from '../../utils/cancel-process'
import { transform } from '../transformers'
import { transformCssVars } from '../transformers/transform-css-vars'
import { transformImport } from '../transformers/transform-import'

export async function updateFiles(
  files: RegistryItem['files'],
  config: Config,
  options: {
    overwrite?: boolean
    force?: boolean
    isRemote?: boolean
  },
): Promise<{ filesCreated: string[], filesUpdated: string[], filesSkipped: string[] }> {
  if (!files?.length) {
    return {
      filesCreated: [],
      filesUpdated: [],
      filesSkipped: [],
    }
  }

  options = {
    overwrite: false,
    force: false,
    isRemote: false,
    ...options,
  }

  const filesCreatedSpinner = p.spinner()
  filesCreatedSpinner.start('Updating files.')

  const [baseColor] = await Promise.all([
    getRegistryBaseColor(config.tailwind.baseColor),
  ])

  const filesCreated = []
  const filesUpdated = []
  const filesSkipped = []

  for (const file of files) {
    if (!file.content) {
      continue
    }

    const filePath = resolveFilePath(file, config)
    const fileName = basename(file.path)
    const targetDir = path.dirname(filePath)

    const existingFile = existsSync(filePath)

    // Run our transformers.
    const content = await transform(
      {
        filename: file.path,
        raw: file.content,
        config,
        baseColor,
      },
      [
        transformImport,
        transformCssVars,
      ],
    )

    // Skip the file if it already exists and the content is the same.
    if (existingFile) {
      const existingFileContent = await fs.readFile(filePath, 'utf-8')
      const [normalizedExisting, normalizedNew] = await Promise.all([
        getNormalizedFileContent(existingFileContent),
        getNormalizedFileContent(content),
      ])
      if (normalizedExisting === normalizedNew) {
        filesSkipped.push(path.relative(config.resolvedPaths.cwd, filePath))
        continue
      }
    }

    if (existingFile && !options.overwrite) {
      const overwrite = await p.confirm({
        message: `The file ${c.blue(
          fileName,
        )} already exists. Would you like to overwrite?`,
        initialValue: false,
      })

      verifyIsCancelPrompt(overwrite)

      if (!overwrite) {
        filesSkipped.push(path.relative(config.resolvedPaths.cwd, filePath))
        continue
      }
    }

    // Create the target directory if it doesn't exist.
    if (!existsSync(targetDir)) {
      await fs.mkdir(targetDir, { recursive: true })
    }

    await fs.writeFile(filePath, content, 'utf-8')
    existingFile
      ? filesUpdated.push(path.relative(config.resolvedPaths.cwd, filePath))
      : filesCreated.push(path.relative(config.resolvedPaths.cwd, filePath))
  }

  const hasUpdatedFiles = filesCreated.length || filesUpdated.length
  if (!hasUpdatedFiles && !filesSkipped.length) {
    filesCreatedSpinner.message('No files updated.')
  }

  if (filesCreated.length) {
    filesCreatedSpinner.stop(
      `Created ${filesCreated.length} ${filesCreated.length === 1 ? 'file' : 'files'
      }:`,
    )

    for (const file of filesCreated) {
      p.log.step(`  - ${file}`)
    }
  }
  else {
    filesCreatedSpinner.stop()
  }

  if (filesUpdated.length) {
    p.log.info(`Updated ${filesUpdated.length} ${filesUpdated.length === 1 ? 'file' : 'files'
    }:`)

    for (const file of filesUpdated) {
      p.log.step(`  - ${file}`)
    }
  }

  if (filesSkipped.length) {
    p.log.info(`Skipped ${filesSkipped.length} ${filesUpdated.length === 1 ? 'file' : 'files'
    }: (files might be identical, use --overwrite to overwrite)`)

    for (const file of filesSkipped) {
      p.log.step(`  - ${file}`)
    }
  }

  return {
    filesCreated,
    filesUpdated,
    filesSkipped,
  }
}

export async function getNormalizedFileContent(content: string): Promise<string> {
  return content.replace(/\r\n/g, '\n').trim()
}

export function resolveFilePath(
  file: v.InferOutput<typeof RegistryItemFileSchema>,
  config: Config,
): string {
  if (file.target) {
    if (file.target.startsWith('~/')) {
      return path.join(config.resolvedPaths.cwd, file.target.replace('~/', ''))
    }

    return path.join(
      config.resolvedPaths.cwd,
      'src',
      file.target.replace('src/', ''),
    )
    // return options.isSrcDir
    //   ? path.join(
    //       config.resolvedPaths.cwd,
    //       'src',
    //       file.target.replace('src/', ''),
    //     )
    //   : path.join(config.resolvedPaths.cwd, file.target.replace('src/', ''))
  }

  const targetDir = resolveFileTargetDirectory(file, config)

  const relativePath = resolveNestedFilePath(file.path, targetDir)
  return path.join(targetDir, relativePath)
}

function resolveFileTargetDirectory(
  file: v.InferOutput<typeof RegistryItemFileSchema>,
  config: Config,
): string {
  if (file.type === 'registry:ui') {
    return config.resolvedPaths.ui
  }

  if (file.type === 'registry:lib') {
    return config.resolvedPaths.lib
  }

  if (file.type === 'registry:block' || file.type === 'registry:component') {
    return config.resolvedPaths.components
  }

  if (file.type === 'registry:service') {
    return config.resolvedPaths.services
  }

  return config.resolvedPaths.components
}

export function resolveNestedFilePath(
  filePath: string,
  targetDir: string,
): string {
  // Normalize paths by removing leading/trailing slashes
  const normalizedFilePath = filePath.replace(/^\/|\/$/g, '')
  const normalizedTargetDir = targetDir.replace(/^\/|\/$/g, '')

  // Split paths into segments
  const fileSegments = normalizedFilePath.split('/')
  const targetSegments = normalizedTargetDir.split('/')

  // Find the last matching segment from targetDir in filePath
  const lastTargetSegment = targetSegments[targetSegments.length - 1]
  const commonDirIndex = fileSegments.findIndex(
    segment => segment === lastTargetSegment,
  )

  if (commonDirIndex === -1) {
    // Return just the filename if no common directory is found
    return fileSegments[fileSegments.length - 1]
  }

  // Return everything after the common directory
  return fileSegments.slice(commonDirIndex + 1).join('/')
}
