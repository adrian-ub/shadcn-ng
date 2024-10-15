import fs from 'node:fs/promises'
import path from 'node:path'

import process from 'node:process'

import { installPackage } from '@antfu/install-pkg'
import * as p from '@clack/prompts'

import { execa } from 'execa'
import { getPackageManager } from './get-package-manager'
import { highlighter } from './highlighter'
import { loadTsConfig } from './load-tsconfig'
import type { InitOptions } from '../schemas/init'

export async function createProject(
  options: Pick<InitOptions, 'cwd' | 'force'>,
): Promise<{ projectPath: null, projectName: null } | { projectPath: string, projectName: string }> {
  if (!options.force) {
    const { proceed } = await p.group({
      proceed: () => p.confirm({
        message: `The path ${highlighter.info(
          options.cwd,
        )} does not contain a package.json file. Would you like to start a new ${highlighter.info(
          'Angular',
        )} project?`,
      }),
    }, {
      onCancel: () => {
        p.cancel('Operation cancelled.')
        process.exit(0)
      },
    })

    if (!proceed) {
      return {
        projectPath: null,
        projectName: null,
      }
    }
  }

  const { name } = await p.group({
    name: () => p.text({
      message: `What is your project named?`,
      placeholder: 'my-app',
      validate: (value: string) => {
        if (value.length > 128) {
          return `Name should be less than 128 characters.`
        }
      },
    }),
  }, {
    onCancel: () => {
      p.cancel('Operation cancelled.')
      process.exit(0)
    },
  })

  const createSpinner = p.spinner()
  createSpinner.start(`Creating a new Angular project.`)

  try {
    const packageManager = await getPackageManager(options.cwd)
    const directory = path.relative(process.cwd(), options.cwd)
    const args = [
      `--directory=${directory}`,
      `--package-manager=${packageManager}`,
      '--routing',
      '--ssr=false',
      '--style=scss',
      `--force=${options.force}`,
      '--interactive=false',
    ]
    const createCommand = packageManager === 'npm' ? 'init' : 'create'

    await execa(packageManager, [createCommand, '@angular@latest', name, ...args])
    await installPackage(['tailwindcss', 'postcss', 'autoprefixer'], { silent: true, cwd: options.cwd, dev: true })

    const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
}`

    const tailwindConfigPath = path.join(options.cwd, 'tailwind.config.js')
    await fs.writeFile(tailwindConfigPath, tailwindConfig)

    const stylesPath = path.join(options.cwd, 'src', 'styles.scss')
    const styles = `@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';`

    await fs.writeFile(stylesPath, styles)

    let { config: tsConfig } = await loadTsConfig(options.cwd)

    tsConfig = {
      ...tsConfig,
      compilerOptions: {
        ...tsConfig.compilerOptions,
        paths: {
          '@/*': ['./src/*'],
        },
        baseUrl: '.',
      },
    }

    await fs.writeFile(path.join(options.cwd, 'tsconfig.json'), JSON.stringify(tsConfig, null, 2))
  }
  catch {
    p.log.error(`Failed to create a new Angular project.`)
    process.exit(1)
  }

  createSpinner.stop(`Created a new Angular project.`)
  return {
    projectPath: options.cwd,
    projectName: name,
  }
}
