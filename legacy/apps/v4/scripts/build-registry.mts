import type { Registry } from '../../../src/registry'
import { exec } from 'node:child_process'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

import { rimraf } from 'rimraf'
import * as z from 'valibot'
import { RegistryItemSchema } from '../../../src/registry'
import { lib } from '../../www/src/registry/registry-lib'
import { ui } from '../../www/src/registry/registry-ui'

const registry = {
  name: 'shadcn-ng',
  homepage: 'https://ui.adrianub.dev',
  items: z.parse(z.array(RegistryItemSchema), [
    {
      name: 'index',
      type: 'registry:style',
      dependencies: [
        'tailwindcss-animate',
        'class-variance-authority',
        '@ng-icons/core',
        '@ng-icons/lucide',
      ],
      registryDependencies: ['utils'],
      tailwind: {
        config: {
          plugins: [`require("tailwindcss-animate")`],
        },
      },
      cssVars: {},
      files: [],
    },
    ...ui,
    ...lib,
  ]),
} satisfies Registry

async function buildRegistryJsonFile() {
  // 1. Fix the path for registry items.
  const fixedRegistry = {
    ...registry,
    items: registry.items.map((item) => {
      const files = item.files?.map((file) => {
        return {
          ...file,
          path: `registry/new-york-v4/${file.path}`,
        }
      })

      return {
        ...item,
        files,
      }
    }),
  }

  // 2. Write the content of the registry to `registry.json`
  rimraf.sync(path.join(process.cwd(), `registry.json`))
  await fs.writeFile(
    path.join(process.cwd(), `src`, `registry.json`),
    JSON.stringify(fixedRegistry, null, 2),
  )
}

async function buildRegistry() {
  return new Promise((resolve, reject) => {
    const childProcess = exec(
      `pnpm -w run start:cli build registry.json --output ../../www/public/r/styles/new-york-v4 --cwd=apps/v4/src`,
    )

    childProcess.on('exit', (code) => {
      if (code === 0) {
        resolve(undefined)
      }
      else {
        reject(new Error(`Process exited with code ${code}`))
      }
    })
  })
}

try {
  console.log('💅 Building registry.json...')
  await buildRegistryJsonFile()

  console.log('🏗️ Building registry...')
  await buildRegistry()
}
catch (error) {
  console.error(error)
  process.exit(1)
}
