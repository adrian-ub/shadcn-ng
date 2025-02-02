import type { InitOptions } from '../schemas/init'

import fs from 'node:fs'
import * as fsPromise from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

import { installPackage } from '@antfu/install-pkg'
import * as p from '@clack/prompts'
import { resolveCommand } from 'package-manager-detector/commands'
import { detect as detectPM } from 'package-manager-detector/detect'
import c from 'picocolors'
import { x } from 'tinyexec'
import { parse } from 'tsconfck'

import { cancelProcess } from '../utils/cancel-process'
import { angularCreateVersion, tailwindPostcssVersion, tailwindV4Version } from '../utils/constants'

export async function createProject(options: InitOptions): Promise<{ projectPath: string }> {
  let projectName: string = 'my-app'
  if (!options.force) {
    const { name } = await p.group({
      name: () => p.text({
        message: 'What is your project named?',
        placeholder: projectName,
        defaultValue: projectName,
        validate: (value: string) => {
          if (value.length > 128) {
            return `Name should be less than 128 characters.`
          }

          if (fs.existsSync(path.resolve(options.cwd, value, 'package.json'))) {
            return `A project with the name ${c.blue(value)} already exists.`
          }
        },
      }),
    }, {
      onCancel: () => cancelProcess(),
    })

    projectName = name
  }

  const pm = await detectPM({
    cwd: options.cwd,
  })

  if (!pm)
    throw new Error('Could not detect package manager')

  const directory = path.relative(process.cwd(), options.cwd)

  const args = [
    `@angular/create@${angularCreateVersion}`,
    projectName,
    `--directory=${directory}`,
    `--package-manager=${pm.name}`,
    '--routing',
    '--ssr=false',
    '--style=css',
    `--force=${options.force}`,
    '--interactive=false',
  ]

  const command = resolveCommand(pm.agent, 'execute', args)!

  const createSpinner = p.spinner()
  createSpinner.start(`Creating project ${c.blue(projectName)}...`)

  await x(command.command, command.args)

  await installPackage(
    [
      `tailwindcss@${tailwindV4Version}`,
      `@tailwindcss/postcss@${tailwindPostcssVersion}`,
      'postcss',
    ],
    {
      cwd: options.cwd,
      silent: true,
      additionalArgs: ['--force'],
    },
  )

  const stylesPath = path.join(options.cwd, 'src', 'styles.css')
  const styleFileContent = `@import 'tailwindcss';`

  await fsPromise.writeFile(stylesPath, styleFileContent)

  const postcssrcJsonPath = path.join(options.cwd, '.postcssrc.json')
  const postcssrcJsonContent = {
    plugins: {
      '@tailwindcss/postcss': {},
    },
  }

  await fsPromise.writeFile(postcssrcJsonPath, JSON.stringify(postcssrcJsonContent, null, 2))
  const tsconfigFile = path.join(options.cwd, 'tsconfig.json')

  let { tsconfig } = await parse(tsconfigFile, {
    ignoreNodeModules: true,
    root: options.cwd,
  })

  tsconfig = {
    ...tsconfig,
    compilerOptions: {
      ...tsconfig.compilerOptions,
      baseUrl: '.',
      paths: {
        '~/*': ['src/app/*'],
      },
    },
  }

  await fsPromise.writeFile(tsconfigFile, JSON.stringify(tsconfig, null, 2))

  createSpinner.stop(`Project ${c.blue(projectName)} created.`)
  return {
    projectPath: options.cwd,
  }
}
