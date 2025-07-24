import type { z } from 'zod'
import type { initOptionsSchema } from '~/src/commands/init'

import path from 'node:path'
import process from 'node:process'

import { getCommand } from '@antfu/ni'
import fs from 'fs-extra'
import prompts from 'prompts'
import { x } from 'tinyexec'

import { getPackageManager } from '~/src/utils/get-package-manager'
import { highlighter } from '~/src/utils/highlighter'
import { logger } from '~/src/utils/logger'
import { spinner } from '~/src/utils/spinner'

export const TEMPLATES = {
  angular: 'angular',
} as const

export async function createProject(
  options: Pick<
    z.infer<typeof initOptionsSchema>,
    'cwd' | 'force' | 'components' | 'template'
  >,
): Promise<{
  projectPath: string
  projectName: string
  template: keyof typeof TEMPLATES
}> {
  let template: keyof typeof TEMPLATES
    = options.template && TEMPLATES[options.template as keyof typeof TEMPLATES]
      ? (options.template as keyof typeof TEMPLATES)
      : 'angular'
  let projectName: string = 'my-app'
  const angularVersion = 'latest'

  if (!options.force) {
    const { type, name } = await prompts([
      {
        type: options.template ? null : 'select',
        name: 'type',
        message: `The path ${highlighter.info(
          options.cwd,
        )} does not contain a package.json file.\n  Would you like to start a new project?`,
        choices: [
          { title: 'Angular', value: 'angular' },
        ],
        initial: 0,
      },
      {
        type: 'text',
        name: 'name',
        message: 'What is your project named?',
        initial: projectName,
        format: (value: string) => value.trim(),
        validate: (value: string) =>
          value.length > 128
            ? `Name should be less than 128 characters.`
            : true,
      },
    ])

    template = type ?? template
    projectName = name
  }

  const packageManager = await getPackageManager(options.cwd, {
    withFallback: true,
  })

  const projectPath = `${options.cwd}/${projectName}`

  // Check if path is writable.
  try {
    await fs.access(options.cwd, fs.constants.W_OK)
  }
  catch {
    logger.break()
    logger.error(`The path ${highlighter.info(options.cwd)} is not writable.`)
    logger.error(
      `It is likely you do not have write permissions for this folder or the path ${highlighter.info(
        options.cwd,
      )} does not exist.`,
    )
    logger.break()
    process.exit(1)
  }

  if (fs.existsSync(path.resolve(options.cwd, projectName, 'package.json'))) {
    logger.break()
    logger.error(
      `A project with the name ${highlighter.info(projectName)} already exists.`,
    )
    logger.error(`Please choose a different name and try again.`)
    logger.break()
    process.exit(1)
  }

  if (template === TEMPLATES.angular) {
    await createAngularProject(projectName, projectPath, {
      version: angularVersion,
      cwd: options.cwd,
      packageManager,
    })
  }

  return {
    projectPath,
    projectName,
    template,
  }
}

async function createAngularProject(
  projectName: string,
  projectPath: string,
  options: {
    version: string
    cwd: string
    packageManager: 'yarn' | 'pnpm' | 'bun' | 'npm' | 'deno'
  },
): Promise<void> {
  const createSpinner = spinner(
    `Creating a new Angular project. This may take a few minutes.`,
  ).start()

  try {
    await x(
      'npx',
      [`create-charada@${options.version}`, projectName, '-t=angular-tailwind'],
      {
        nodeOptions: {
          cwd: options.cwd,
        },
      },
    )

    const { command, args } = getCommand(options.packageManager, 'install')

    await x(
      command,
      [...args],
      {
        nodeOptions: {
          cwd: projectPath,
        },
      },
    )
  }
  catch {
    logger.break()
    logger.error(
      `Something went wrong creating a new Angular project. Please try again.`,
    )
    process.exit(1)
  }

  createSpinner?.succeed('Creating a new Angular project.')
}
