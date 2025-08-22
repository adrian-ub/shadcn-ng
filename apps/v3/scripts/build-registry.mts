import type {
  Registry,
  registryItemTypeSchema,
} from 'shadcn-ng/schema'
import type { z } from 'zod'

import { existsSync, promises as fs } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import process from 'node:process'
import template from 'lodash/template'
import { rimraf } from 'rimraf'
import {
  registryItemSchema,
  registrySchema,
} from 'shadcn-ng/schema'
import { Project, ScriptKind } from 'ts-morph'

import { registry } from '../registry'
import { baseColors, baseColorsV4 } from '../registry/registry-base-colors'
import { colorMapping, colors } from '../registry/registry-colors'
import { icons } from '../registry/registry-icons'
import { styles } from '../registry/registry-styles'
import { fixImport } from './fix-import.mts'

const REGISTRY_PATH = path.join(process.cwd(), 'public/r')

const REGISTRY_INDEX_WHITELIST: z.infer<typeof registryItemTypeSchema>[] = [
  'registry:ui',
  'registry:lib',
  'registry:hook',
  'registry:theme',
  'registry:block',
  'registry:example',
  'registry:internal',
  'registry:style',
]

const project = new Project({
  compilerOptions: {},
})

async function createTempSourceFile(filename: string) {
  const dir = await fs.mkdtemp(path.join(tmpdir(), 'shadcn-'))
  return path.join(dir, filename)
}

// ----------------------------------------------------------------------------
// Sync styles
// ----------------------------------------------------------------------------
async function syncStyles() {
  const sourceStyle = 'new-york'
  const targetStyle = 'default'

  const syncDirectories = ['blocks', 'hooks', 'internal', 'lib', 'charts']

  // Clean up sync directories.
  for (const dir of syncDirectories) {
    rimraf.sync(path.join('registry', targetStyle, dir))
  }

  for (const item of registry.items) {
    if (
      !REGISTRY_INDEX_WHITELIST.includes(item.type)
      && item.type !== 'registry:ui'
    ) {
      continue
    }

    const resolveFiles = item.files?.map(
      file =>
        `registry/${sourceStyle}/${typeof file === 'string' ? file : file.path}`,
    )
    if (!resolveFiles) {
      continue
    }

    // Copy files to target style if they don't exist.
    for (const file of resolveFiles) {
      const sourcePath = path.join(process.cwd(), file)
      const targetPath = path.join(
        process.cwd(),
        file.replace(sourceStyle, targetStyle),
      )

      if (!existsSync(targetPath)) {
        // Create directory if it doesn't exist.
        await fs.mkdir(path.dirname(targetPath), { recursive: true })
        await fs.copyFile(sourcePath, targetPath)

        // Replace all @/registry/new-york/ with @/registry/default/.
        const content = await fs.readFile(targetPath, 'utf8')
        const fixedContent = content.replace(
          new RegExp(`@/registry/${sourceStyle}/`, 'g'),
          `@/registry/${targetStyle}/`,
        )
        await fs.writeFile(targetPath, fixedContent, 'utf8')
      }
    }
  }
}

// ----------------------------------------------------------------------------
// Build registry/styles/[style]/[name].json.
// ----------------------------------------------------------------------------
async function buildStyles(registry: Registry) {
  for (const style of styles) {
    const targetPath = path.join(REGISTRY_PATH, 'styles', style.name)

    // Create directory if it doesn't exist.
    if (!existsSync(targetPath)) {
      await fs.mkdir(targetPath, { recursive: true })
    }

    // Build registry.json for this style
    const styleRegistryItems = []

    for (const item of registry.items) {
      if (!REGISTRY_INDEX_WHITELIST.includes(item.type)) {
        continue
      }

      let files
      if (item.files) {
        files = await Promise.all(
          item.files.map(async (_file) => {
            const file
              = typeof _file === 'string'
                ? {
                    path: _file,
                    type: item.type,
                    content: '',
                    target: '',
                  }
                : _file

            let content: string
            try {
              content = await fs.readFile(
                path.join(process.cwd(), 'registry', style.name, file.path),
                'utf8',
              )

              // Only fix imports for v0- blocks.
              if (item.name.startsWith('v0-')) {
                content = fixImport(content)
              }
            }
            catch {
              return
            }

            const tempFile = await createTempSourceFile(file.path)
            const sourceFile = project.createSourceFile(tempFile, content, {
              scriptKind: ScriptKind.TSX,
            })

            sourceFile.getVariableDeclaration('iframeHeight')?.remove()
            sourceFile.getVariableDeclaration('containerClassName')?.remove()
            sourceFile.getVariableDeclaration('description')?.remove()

            let target = file.target || ''

            if ((!target || target === '') && item.name.startsWith('v0-')) {
              const fileName = file.path.split('/').pop()
              if (
                file.type === 'registry:block'
                || file.type === 'registry:component'
                || file.type === 'registry:example'
              ) {
                target = `components/${fileName}`
              }

              if (file.type === 'registry:ui') {
                target = `components/ui/${fileName}`
              }

              if (file.type === 'registry:hook') {
                target = `hooks/${fileName}`
              }

              if (file.type === 'registry:lib') {
                target = `lib/${fileName}`
              }
            }

            return {
              path: file.path,
              type: file.type,
              content: sourceFile.getText(),
              target,
            }
          }),
        )
      }

      const payload = registryItemSchema.safeParse({
        $schema: 'https://ui.adrianub.dev/schema/registry-item.json',
        author: 'shadcn-ng (https://ui.adrianub.dev)',
        ...item,
        files,
      })

      if (payload.success) {
        await fs.writeFile(
          path.join(targetPath, `${item.name}.json`),
          JSON.stringify(payload.data, null, 2),
          'utf8',
        )

        // Add item to style registry with fixed paths (without content)
        styleRegistryItems.push({
          ...item,
          files: files
            ?.map((file: any) => {
              if (!file)
                return null
              // Exclude content from registry.json
              const { content, ...fileWithoutContent } = file
              return {
                ...fileWithoutContent,
                path: `registry/${style.name}/${file.path}`,
              }
            })
            .filter(Boolean),
        })
      }
    }

    // Build registry.json for this style following registrySchema format
    const styleRegistry = {
      name: registry.name,
      homepage: registry.homepage,
      items: styleRegistryItems,
    }

    // Validate against registrySchema
    const validatedRegistry = registrySchema.safeParse(styleRegistry)
    if (validatedRegistry.success) {
      const styleRegistryJson = JSON.stringify(validatedRegistry.data, null, 2)
      await fs.writeFile(
        path.join(targetPath, 'registry.json'),
        styleRegistryJson,
        'utf8',
      )
    }
    else {
      console.error(
        `Failed to validate registry for style ${style.name}:`,
        validatedRegistry.error,
      )
    }
  }

  // ----------------------------------------------------------------------------
  // Build registry/styles/index.json.
  // ----------------------------------------------------------------------------
  const stylesJson = JSON.stringify(styles, null, 2)
  await fs.writeFile(
    path.join(REGISTRY_PATH, 'styles/index.json'),
    stylesJson,
    'utf8',
  )
}

// ----------------------------------------------------------------------------
// Build registry/colors/index.json.
// ----------------------------------------------------------------------------
async function buildThemes() {
  const colorsTargetPath = path.join(REGISTRY_PATH, 'colors')
  rimraf.sync(colorsTargetPath)
  if (!existsSync(colorsTargetPath)) {
    await fs.mkdir(colorsTargetPath, { recursive: true })
  }

  const colorsData: Record<string, any> = {}
  for (const [color, value] of Object.entries(colors)) {
    if (typeof value === 'string') {
      colorsData[color] = value
      continue
    }

    if (Array.isArray(value)) {
      colorsData[color] = value.map(item => ({
        ...item,
        rgbChannel: item.rgb.replace(/^rgb\((\d+),(\d+),(\d+)\)$/, '$1 $2 $3'),
        hslChannel: item.hsl.replace(
          /^hsl\(([\d.]+),([\d.]+%),([\d.]+%)\)$/,
          '$1 $2 $3',
        ),
      }))
      continue
    }

    if (typeof value === 'object') {
      colorsData[color] = {
        ...value,
        rgbChannel: value.rgb.replace(/^rgb\((\d+),(\d+),(\d+)\)$/, '$1 $2 $3'),
        hslChannel: value.hsl.replace(
          /^hsl\(([\d.]+),([\d.]+%),([\d.]+%)\)$/,
          '$1 $2 $3',
        ),
      }
      continue
    }
  }

  await fs.writeFile(
    path.join(colorsTargetPath, 'index.json'),
    JSON.stringify(colorsData, null, 2),
    'utf8',
  )

  // ----------------------------------------------------------------------------
  // Build registry/colors/[base].json.
  // ----------------------------------------------------------------------------
  const BASE_STYLES = `@tailwind base;
@tailwind components;
@tailwind utilities;
  `

  const BASE_STYLES_WITH_VARIABLES = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: <%- colors.light["background"] %>;
    --foreground: <%- colors.light["foreground"] %>;
    --card: <%- colors.light["card"] %>;
    --card-foreground: <%- colors.light["card-foreground"] %>;
    --popover: <%- colors.light["popover"] %>;
    --popover-foreground: <%- colors.light["popover-foreground"] %>;
    --primary: <%- colors.light["primary"] %>;
    --primary-foreground: <%- colors.light["primary-foreground"] %>;
    --secondary: <%- colors.light["secondary"] %>;
    --secondary-foreground: <%- colors.light["secondary-foreground"] %>;
    --muted: <%- colors.light["muted"] %>;
    --muted-foreground: <%- colors.light["muted-foreground"] %>;
    --accent: <%- colors.light["accent"] %>;
    --accent-foreground: <%- colors.light["accent-foreground"] %>;
    --destructive: <%- colors.light["destructive"] %>;
    --destructive-foreground: <%- colors.light["destructive-foreground"] %>;
    --border: <%- colors.light["border"] %>;
    --input: <%- colors.light["input"] %>;
    --ring: <%- colors.light["ring"] %>;
    --radius: 0.5rem;
    --chart-1: <%- colors.light["chart-1"] %>;
    --chart-2: <%- colors.light["chart-2"] %>;
    --chart-3: <%- colors.light["chart-3"] %>;
    --chart-4: <%- colors.light["chart-4"] %>;
    --chart-5: <%- colors.light["chart-5"] %>;
  }

  .dark {
    --background: <%- colors.dark["background"] %>;
    --foreground: <%- colors.dark["foreground"] %>;
    --card: <%- colors.dark["card"] %>;
    --card-foreground: <%- colors.dark["card-foreground"] %>;
    --popover: <%- colors.dark["popover"] %>;
    --popover-foreground: <%- colors.dark["popover-foreground"] %>;
    --primary: <%- colors.dark["primary"] %>;
    --primary-foreground: <%- colors.dark["primary-foreground"] %>;
    --secondary: <%- colors.dark["secondary"] %>;
    --secondary-foreground: <%- colors.dark["secondary-foreground"] %>;
    --muted: <%- colors.dark["muted"] %>;
    --muted-foreground: <%- colors.dark["muted-foreground"] %>;
    --accent: <%- colors.dark["accent"] %>;
    --accent-foreground: <%- colors.dark["accent-foreground"] %>;
    --destructive: <%- colors.dark["destructive"] %>;
    --destructive-foreground: <%- colors.dark["destructive-foreground"] %>;
    --border: <%- colors.dark["border"] %>;
    --input: <%- colors.dark["input"] %>;
    --ring: <%- colors.dark["ring"] %>;
    --chart-1: <%- colors.dark["chart-1"] %>;
    --chart-2: <%- colors.dark["chart-2"] %>;
    --chart-3: <%- colors.dark["chart-3"] %>;
    --chart-4: <%- colors.dark["chart-4"] %>;
    --chart-5: <%- colors.dark["chart-5"] %>;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}`

  for (const baseColor of ['slate', 'gray', 'zinc', 'neutral', 'stone']) {
    const base: Record<string, any> = {
      inlineColors: {},
      cssVars: {},
    }
    for (const [mode, values] of Object.entries(colorMapping)) {
      base.inlineColors[mode] = {}
      base.cssVars[mode] = {}
      for (const [key, value] of Object.entries(values)) {
        if (typeof value === 'string') {
          // Chart colors do not have a 1-to-1 mapping with tailwind colors.
          if (key.startsWith('chart-')) {
            base.cssVars[mode][key] = value
            continue
          }

          const resolvedColor = value.replace(/\{\{base\}\}-/g, `${baseColor}-`)
          base.inlineColors[mode][key] = resolvedColor

          const [resolvedBase, scale] = resolvedColor.split('-')
          const color = scale
            ? colorsData[resolvedBase].find(
                (item: any) => item.scale === Number.parseInt(scale),
              )
            : colorsData[resolvedBase]
          if (color) {
            base.cssVars[mode][key] = color.hslChannel
          }
        }
      }
    }

    // Add v4 css vars.
    base.cssVarsV4 = baseColorsV4[baseColor as keyof typeof baseColorsV4]

    // Build css vars.
    base.inlineColorsTemplate = template(BASE_STYLES)({})
    base.cssVarsTemplate = template(BASE_STYLES_WITH_VARIABLES)({
      colors: base.cssVars,
    })

    await fs.writeFile(
      path.join(REGISTRY_PATH, `colors/${baseColor}.json`),
      JSON.stringify(base, null, 2),
      'utf8',
    )

    // ----------------------------------------------------------------------------
    // Build registry/themes.css
    // ----------------------------------------------------------------------------
    const THEME_STYLES_WITH_VARIABLES = `
.theme-<%- theme %> {
  --background: <%- colors.light["background"] %>;
  --foreground: <%- colors.light["foreground"] %>;

  --muted: <%- colors.light["muted"] %>;
  --muted-foreground: <%- colors.light["muted-foreground"] %>;

  --popover: <%- colors.light["popover"] %>;
  --popover-foreground: <%- colors.light["popover-foreground"] %>;

  --card: <%- colors.light["card"] %>;
  --card-foreground: <%- colors.light["card-foreground"] %>;

  --border: <%- colors.light["border"] %>;
  --input: <%- colors.light["input"] %>;

  --primary: <%- colors.light["primary"] %>;
  --primary-foreground: <%- colors.light["primary-foreground"] %>;

  --secondary: <%- colors.light["secondary"] %>;
  --secondary-foreground: <%- colors.light["secondary-foreground"] %>;

  --accent: <%- colors.light["accent"] %>;
  --accent-foreground: <%- colors.light["accent-foreground"] %>;

  --destructive: <%- colors.light["destructive"] %>;
  --destructive-foreground: <%- colors.light["destructive-foreground"] %>;

  --ring: <%- colors.light["ring"] %>;

  --radius: <%- colors.light["radius"] %>;
}

.dark .theme-<%- theme %> {
  --background: <%- colors.dark["background"] %>;
  --foreground: <%- colors.dark["foreground"] %>;

  --muted: <%- colors.dark["muted"] %>;
  --muted-foreground: <%- colors.dark["muted-foreground"] %>;

  --popover: <%- colors.dark["popover"] %>;
  --popover-foreground: <%- colors.dark["popover-foreground"] %>;

  --card: <%- colors.dark["card"] %>;
  --card-foreground: <%- colors.dark["card-foreground"] %>;

  --border: <%- colors.dark["border"] %>;
  --input: <%- colors.dark["input"] %>;

  --primary: <%- colors.dark["primary"] %>;
  --primary-foreground: <%- colors.dark["primary-foreground"] %>;

  --secondary: <%- colors.dark["secondary"] %>;
  --secondary-foreground: <%- colors.dark["secondary-foreground"] %>;

  --accent: <%- colors.dark["accent"] %>;
  --accent-foreground: <%- colors.dark["accent-foreground"] %>;

  --destructive: <%- colors.dark["destructive"] %>;
  --destructive-foreground: <%- colors.dark["destructive-foreground"] %>;

  --ring: <%- colors.dark["ring"] %>;
}`

    const themeCSS = []
    for (const theme of baseColors) {
      themeCSS.push(
        template(THEME_STYLES_WITH_VARIABLES)({
          colors: theme.cssVars,
          theme: theme.name,
        }),
      )
    }

    await fs.writeFile(
      path.join(REGISTRY_PATH, `themes.css`),
      themeCSS.join('\n'),
      'utf8',
    )

    // ----------------------------------------------------------------------------
    // Build registry/themes/[theme].json
    // ----------------------------------------------------------------------------
    rimraf.sync(path.join(REGISTRY_PATH, 'themes'))
    for (const baseColor of ['slate', 'gray', 'zinc', 'neutral', 'stone']) {
      const payload: Record<string, any> = {
        name: baseColor,
        label: baseColor.charAt(0).toUpperCase() + baseColor.slice(1),
        cssVars: {},
      }
      for (const [mode, values] of Object.entries(colorMapping)) {
        payload.cssVars[mode] = {}
        for (const [key, value] of Object.entries(values)) {
          if (typeof value === 'string') {
            const resolvedColor = value.replace(/\{\{base\}\}-/g, `${baseColor}-`)
            payload.cssVars[mode][key] = resolvedColor

            const [resolvedBase, scale] = resolvedColor.split('-')
            const color = scale
              ? colorsData[resolvedBase].find(
                  (item: any) => item.scale === Number.parseInt(scale),
                )
              : colorsData[resolvedBase]
            if (color) {
              payload.cssVars[mode][key] = color.hslChannel
            }
          }
        }
      }

      const targetPath = path.join(REGISTRY_PATH, 'themes')

      // Create directory if it doesn't exist.
      if (!existsSync(targetPath)) {
        await fs.mkdir(targetPath, { recursive: true })
      }

      await fs.writeFile(
        path.join(targetPath, `${payload.name}.json`),
        JSON.stringify(payload, null, 2),
        'utf8',
      )
    }
  }
}

// ----------------------------------------------------------------------------
// Build registry/icons/index.json.
// ----------------------------------------------------------------------------
async function buildIcons() {
  const iconsTargetPath = path.join(REGISTRY_PATH, 'icons')
  rimraf.sync(iconsTargetPath)
  if (!existsSync(iconsTargetPath)) {
    await fs.mkdir(iconsTargetPath, { recursive: true })
  }

  const iconsData = icons

  await fs.writeFile(
    path.join(iconsTargetPath, 'index.json'),
    JSON.stringify(iconsData, null, 2),
    'utf8',
  )
}

async function syncRegistry() {
  // Copy the public/r directory to v4/public/r without triggering v4's build
  const v3PublicR = path.resolve(process.cwd(), 'public/r')
  const wwwPublicR = path.resolve(process.cwd(), '../www/public/r')

  // Ensure the source directory exists
  if (!existsSync(v3PublicR)) {
    await fs.mkdir(v3PublicR, { recursive: true })
  }

  // Clean and recreate the v4/public/r directory
  rimraf.sync(wwwPublicR)
  await fs.mkdir(wwwPublicR, { recursive: true })

  // Copy files from www to v4
  await fs.cp(v3PublicR, wwwPublicR, { recursive: true })
}

try {
  console.log('💽 Building registry...')
  const result = registrySchema.safeParse(registry)

  if (!result.success) {
    console.error(result.error)
    process.exit(1)
  }

  await syncStyles()
  await buildStyles(result.data)
  await buildThemes()

  await buildIcons()

  console.log('🔄 Syncing registry...')
  await syncRegistry()

  console.log('✅ Done!')
  process.exit(0)
}
catch (error) {
  console.error(error)
  process.exit(1)
}
