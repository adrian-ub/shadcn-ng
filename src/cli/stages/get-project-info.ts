import type { Config, RawConfig } from '../../registry/schema'
import type { Framework } from '../utils/frameworks'

import fs from 'node:fs/promises'
import path from 'node:path'
import fg from 'fast-glob'
import { getPackageInfo } from 'local-pkg'
import { loadConfig as loadTsConfigPaths } from 'tsconfig-paths'
import { loadConfig } from 'unconfig'

import { FRAMEWORKS } from '../utils/frameworks'
import { $schema, getConfig, resolveConfigPaths } from './get-config'

export type TailwindVersion = 'v3' | 'v4' | null

export interface ProjectInfo {
  framework: Framework
  tailwindConfigFile: string | null
  tailwindCssFile: string | null
  tailwindVersion: TailwindVersion
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
    configFiles,
    tailwindVersion,
    tailwindCssFile,
    tailwindConfigFile,
    aliasPrefix,
  ] = await Promise.all([
    loadConfig({
      sources: [
        {
          files: 'vite.config',
        },
        {
          files: 'angular',
          extensions: ['json'],
        },
      ],
      cwd,
    }),
    getTailwindVersion(cwd),
    getTailwindCssFile(cwd),
    getTailwindConfigFile(cwd),
    getTsConfigAliasPrefix(cwd),
  ])

  const type: ProjectInfo = {
    tailwindVersion,
    framework: FRAMEWORKS.manual,
    tailwindCssFile,
    tailwindConfigFile,
    aliasPrefix,
  }

  if (configFiles.sources.find(source => source.includes('angular'))) {
    type.framework = FRAMEWORKS.angular
  }

  if (configFiles.sources.find(source => source.includes('vite.config'))) {
    type.framework = FRAMEWORKS.vite
  }

  return type
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
    `@import "tailwindcss"`,
    `@import 'tailwindcss'`,
  ]

  for (const file of files) {
    const contents = await fs.readFile(path.resolve(cwd, file), 'utf8')
    if (patterns.some(pattern => contents.includes(pattern))) {
      return file
    }
  }

  return null
}

export async function getTailwindVersion(
  cwd: string,
): Promise<TailwindVersion> {
  const tailwindPackageInfo = await getPackageInfo('tailwindcss', {
    paths: [`${cwd}/node_modules`, cwd],
  })

  if (!tailwindPackageInfo || !tailwindPackageInfo.version)
    return null

  if (
    /^(?:\^|~)?3(?:\.\d+)*(?:-.*)?$/.test(
      tailwindPackageInfo.version,
    )
  ) {
    return 'v3'
  }

  return 'v4'
}

export async function getTailwindConfigFile(cwd: string): Promise<string | null> {
  const { sources } = await loadConfig({
    sources: [
      {
        files: 'tailwind.config',
      },
    ],
    cwd,
  })

  return sources[0] ? path.relative(cwd, sources[0]) : null
}

export async function getTsConfigAliasPrefix(cwd: string): Promise<string | null> {
  const tsConfig = await loadTsConfigPaths(cwd)

  if (
    tsConfig?.resultType === 'failed'
    || !Object.entries(tsConfig?.paths).length
  ) {
    return null
  }

  // This assume that the first alias is the prefix.
  for (const [alias, paths] of Object.entries(tsConfig.paths)) {
    if (
      paths.includes('./*')
      || paths.includes('./src/app/*')
      || paths.includes('src/app/*')
    ) {
      return alias.replace(/\/\*$/, '') ?? null
    }
  }

  // Use the first alias as the prefix.
  return Object.keys(tsConfig?.paths)?.[0].replace(/\/\*$/, '') ?? null
}

export async function getProjectConfig(
  cwd: string,
  defaultProjectInfo: ProjectInfo | null = null,
): Promise<Config | null> {
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
    || !projectInfo.tailwindCssFile
    || (projectInfo.tailwindVersion === 'v3' && !projectInfo.tailwindConfigFile)
  ) {
    return null
  }

  const config: RawConfig = {
    $schema,
    style: 'new-york',
    tailwind: {
      config: projectInfo.tailwindConfigFile ?? '',
      baseColor: 'zinc',
      css: projectInfo.tailwindCssFile,
      cssVariables: true,
      prefix: '',
    },
    iconLibrary: 'lucide',
    aliases: {
      components: `${projectInfo.aliasPrefix}/components`,
      ui: `${projectInfo.aliasPrefix}/components/ui`,
      services: `${projectInfo.aliasPrefix}/services`,
      lib: `${projectInfo.aliasPrefix}/lib`,
      utils: `${projectInfo.aliasPrefix}/lib/utils`,
    },
  }

  return await resolveConfigPaths(cwd, config)
}

export async function getProjectTailwindVersionFromConfig(
  config: Config,
): Promise<TailwindVersion> {
  if (!config.resolvedPaths.cwd) {
    return 'v3'
  }

  const projectInfo = await getProjectInfo(config.resolvedPaths.cwd)

  if (!projectInfo?.tailwindVersion) {
    return null
  }

  return projectInfo.tailwindVersion
}
