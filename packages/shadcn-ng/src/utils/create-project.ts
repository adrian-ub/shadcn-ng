import type { z } from 'zod'
import type { initOptionsSchema } from '@/src/commands/init'
import { Buffer } from 'node:buffer'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { execa } from 'execa'
import fs from 'fs-extra'
import prompts from 'prompts'
import { getPackageManager } from '@/src/utils/get-package-manager'
import { handleError } from '@/src/utils/handle-error'
import { highlighter } from '@/src/utils/highlighter'
import { logger } from '@/src/utils/logger'
import { spinner } from '@/src/utils/spinner'

const MONOREPO_TEMPLATE_URL
  = 'https://codeload.github.com/adrian-ub/shadcn-ng/tar.gz/main'

export const TEMPLATES = {
  'angular': 'angular',
  'angular-monorepo': 'angular-monorepo',
} as const

export async function createProject(
  options: Pick<
    z.infer<typeof initOptionsSchema>,
    'cwd' | 'force' | 'components' | 'template'
  >,
) {
  let template: keyof typeof TEMPLATES
    = options.template && TEMPLATES[options.template as keyof typeof TEMPLATES]
      ? (options.template as keyof typeof TEMPLATES)
      : 'angular'
  let projectName: string
    = template === TEMPLATES.angular ? 'my-app' : 'my-monorepo'

  const isRemoteComponent
    = options.components?.length === 1
      && !!options.components[0].match(/\/chat\/b\//)

  if (options.components && isRemoteComponent) {
    template = TEMPLATES.angular
  }

  if (!options.force) {
    const { type, name } = await prompts([
      {
        type: options.template || isRemoteComponent ? null : 'select',
        name: 'type',
        message: `The path ${highlighter.info(
          options.cwd,
        )} does not contain a package.json file.\n  Would you like to start a new project?`,
        choices: [
          { title: 'Angular', value: 'angular' },
          { title: 'Angular (Monorepo)', value: 'angular-monorepo' },
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

  await createMonorepoProject(template, projectPath, {
    packageManager,
  })

  return {
    projectPath,
    projectName,
    template,
  }
}

async function createMonorepoProject(
  projectType: 'angular' | 'angular-monorepo',
  projectPath: string,
  options: {
    packageManager: string
  },
) {
  const titleProjects = {
    'angular': 'Angular project',
    'angular-monorepo': 'Angular monorepo',
  }
  const createSpinner = spinner(
    `Creating a new ${titleProjects[projectType]}. This may take a few minutes.`,
  ).start()

  try {
    // Get the template.
    const templatePath = path.join(os.tmpdir(), `shadcn-ng-template-${Date.now()}`)
    await fs.ensureDir(templatePath)
    const response = await fetch(MONOREPO_TEMPLATE_URL)
    if (!response.ok) {
      throw new Error(`Failed to download template: ${response.statusText}`)
    }

    // Write the tar file
    const tarPath = path.resolve(templatePath, 'template.tar.gz')
    await fs.writeFile(tarPath, Buffer.from(await response.arrayBuffer()))
    await execa('tar', [
      '-xzf',
      tarPath,
      '-C',
      templatePath,
      '--strip-components=2',
      `shadcn-ng-main/templates/${projectType}`,
    ])
    const extractedPath = path.resolve(templatePath, 'monorepo-next')
    await fs.move(extractedPath, projectPath)
    await fs.remove(templatePath)

    // Run install.
    await execa(options.packageManager, ['install'], {
      cwd: projectPath,
    })

    // Try git init.
    await execa('git', ['--version'], { cwd: projectPath })
    await execa('git', ['init'], { cwd: projectPath })
    await execa('git', ['add', '-A'], { cwd: projectPath })
    await execa('git', ['commit', '-m', 'Initial commit'], {
      cwd: projectPath,
    })

    createSpinner?.succeed(`Creating a new ${titleProjects[projectType]}.`)
  }
  catch (error) {
    createSpinner?.fail(`Something went wrong creating a new ${titleProjects[projectType]}.`)
    handleError(error)
  }
}
