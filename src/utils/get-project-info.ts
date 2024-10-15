import fs from 'node:fs/promises'
import path from 'node:path'

import fg from 'fast-glob'
import { loadConfig as loadTsConfig } from 'tsconfig-paths'
import { loadConfig } from 'unconfig'

import { FRAMEWORKS } from './frameworks'
import {
  getConfig,
  resolveConfigPaths,
} from './get-config'
import type { Framework } from './frameworks'
import type {
  Config,
  RawConfig,
} from './get-config'

export interface ProjectInfo {
  framework: Framework
  tailwindConfigFile: string | null
  tailwindCssFile: string | null
  aliasPrefix: string | null
}

const PROJECT_SHARED_IGNORE = [
  '**/node_modules/**',
  'public',
  'dist',
  'build',
  'coverage',
]

export async function getProjectInfo(cwd: string): Promise<ProjectInfo | null> {
  const [
    framework,
    tailwindConfigFile,
    tailwindCssFile,
    aliasPrefix,
  ] = await Promise.all([
    getFramework(cwd),
    getTailwindConfigFile(cwd),
    getTailwindCssFile(cwd),
    getTsConfigAliasPrefix(cwd),
  ])

  const type: ProjectInfo = {
    framework,
    tailwindConfigFile,
    tailwindCssFile,
    aliasPrefix,
  }

  return type
}

export async function getFramework(cwd: string): Promise<Framework> {
  const { config: configAngular } = await loadConfig({
    cwd,
    stopAt: path.parse(cwd).dir,
    sources: [
      {
        files: ['angular.json'],
      },
    ],
  })

  if (configAngular) {
    return FRAMEWORKS.angular
  }

  return FRAMEWORKS.manual
}

export async function getTailwindCssFile(cwd: string): Promise<string | null> {
  const files = await fg.glob(['**/*.css', '**/*.scss'], {
    cwd,
    deep: 5,
    ignore: PROJECT_SHARED_IGNORE,
  })

  if (!files.length) {
    return null
  }

  const patterns = [
    '@tailwind base',
    `@import "tailwindcss/base"`,
    `@import 'tailwindcss/base'`,
  ]

  for (const file of files) {
    const contents = await fs.readFile(path.resolve(cwd, file), 'utf8')
    // Assume that if the file contains `@tailwind base` or `@import 'tailwindcss/base'` it's the main css file.
    if (patterns.some(pattern => contents.includes(pattern))) {
      return file
    }
  }

  return null
}

export async function getTailwindConfigFile(cwd: string): Promise<string | null> {
  const { sources } = await loadConfig({
    cwd,
    stopAt: path.parse(cwd).dir,
    sources: [
      {
        files: ['tailwind.config'],
      },
    ],
  })

  return sources[0] || null
}

export async function getTsConfigAliasPrefix(cwd: string): Promise<string | null> {
  const tsConfig = loadTsConfig(cwd)

  if (tsConfig?.resultType === 'failed' || !tsConfig?.paths) {
    return null
  }

  const patterns = [
    './*',
    './src/*',
    'src/*',
  ]

  // This assume that the first alias is the prefix.
  for (const [alias, paths] of Object.entries(tsConfig.paths)) {
    if (patterns.some(pattern => paths.includes(pattern))) {
      return alias.at(0) ?? null
    }
  }

  return null
}

export async function getProjectConfig(
  cwd: string,
  defaultProjectInfo: ProjectInfo | null = null,
): Promise<Config | null> {
  // Check for existing component config.
  const [existingConfig, projectInfo] = await Promise.all([
    getConfig(cwd),
    !defaultProjectInfo
      ? getProjectInfo(cwd)
      : Promise.resolve(defaultProjectInfo),
  ])

  if (existingConfig) {
    return existingConfig
  }

  if (
    !projectInfo
    || !projectInfo.tailwindConfigFile
    || !projectInfo.tailwindCssFile
  ) {
    return null
  }

  const config: RawConfig = {
    $schema: 'https://ui.adrianub.dev/schema.json',
    style: 'new-york',
    tailwind: {
      config: projectInfo.tailwindConfigFile,
      baseColor: 'zinc',
      css: projectInfo.tailwindCssFile,
      cssVariables: true,
      prefix: '',
    },
    aliases: {
      components: `${projectInfo.aliasPrefix}/components`,
      ui: `${projectInfo.aliasPrefix}/components/ui`,
      lib: `${projectInfo.aliasPrefix}/lib`,
      utils: `${projectInfo.aliasPrefix}/lib/utils`,
    },
  }

  return await resolveConfigPaths(cwd, config)
}
