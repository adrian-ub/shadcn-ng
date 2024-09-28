import angular from '@analogjs/astro-angular'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import { transformerMetaHighlight } from '@shikijs/transformers'
import { defineConfig } from 'astro/config'

import { visit } from 'unist-util-visit'
import { siteConfig } from './src/config/site'
import blackout from './theme/dark.json'

// Función recursiva para extraer todos los valores de texto
function extractText(node) {
  if (node.type === 'text') {
    return node.value
  }
  if (node.children) {
    return node.children.map(extractText).join('')
  }
  return ''
}

// https://astro.build/config
export default defineConfig({
  site: siteConfig.url,
  trailingSlash: 'never',
  integrations: [
    mdx(),
    angular(),
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap({
      serialize(item) {
        if (item.url === siteConfig.url) {
          item.changefreq = 'daily'
          item.lastmod = new Date()
          item.priority = 1
        }
        else {
          item.changefreq = 'daily'
          item.lastmod = new Date()
          item.priority = 0.9
        }
        return item
      },
    }),
  ],
  markdown: {
    shikiConfig: {
      theme: blackout,
      transformers: [transformerMetaHighlight()],
    },
    rehypePlugins: [
      () => (tree) => {
        visit(tree, 'element', (node) => {
          if (node.tagName !== 'pre')
            return

          const [codeEl] = node.children

          if (codeEl.tagName !== 'code')
            return

          const rawString = extractText(codeEl)

          node.properties = node.properties || {}
          node.properties.rawString = rawString
        })
      },
      () => (tree) => {
        visit(tree, 'element', (node) => {
          if (node.tagName !== 'pre')
            return

          const rawString = node.properties.rawString

          // npm install.
          if (rawString?.startsWith('npm install')) {
            node.properties.npmCommand = rawString
            node.properties.yarnCommand = rawString.replace('npm install', 'yarn add')
            node.properties.pnpmCommand = rawString.replace('npm install', 'pnpm add')
          }

          // npx create.
          if (rawString?.startsWith('npx create-')) {
            node.properties.npmCommand = rawString
            node.properties.yarnCommand = rawString.replace('npx create-', 'yarn create ')
            node.properties.pnpmCommand = rawString.replace('npx create-', 'pnpm create ')
          }

          // npx.
          if (rawString?.startsWith('npx') && !rawString.startsWith('npx create-')) {
            node.properties.npmCommand = rawString
            node.properties.yarnCommand = rawString
            node.properties.pnpmCommand = rawString.replace('npx', 'pnpm dlx')
          }
        })
      },
    ],
  },
  redirects: {
    '/docs/components': '/docs/components/accordion',
  },
  vite: {
    optimizeDeps: {
      include: [
        '@radix-ng/primitives',
        '@angular/common',
        '@angular/core',
        '@angular/cdk',
        '@ng-icons/core',
        '@ng-icons/lucide',
      ],
    },
    ssr: {
      noExternal: [
        '@radix-ng/primitives',
        '@angular/cdk',
        '@ng-icons/core',
        '@ng-icons/lucide',
      ],
    },
  },
})
