import path from 'node:path'
import { fileURLToPath } from 'node:url'

import angular from '@analogjs/astro-angular'
import alpinejs from '@astrojs/alpinejs'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import { getHighlighter } from '@shikijs/compat'
import { defineConfig } from 'astro/config'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { rehypePrettyCode } from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import { codeImport } from 'remark-code-import'

import { visit } from 'unist-util-visit'
import { rehypeComponent } from './plugins/rehype-component'
import { rehypeNpmCommand } from './plugins/rehype-npm-command'

import { siteConfig } from './src/config/site'

/** @type {import('rehype-pretty-code').Options} */
const optionsRehypePrettyCode = {
  theme: 'github-dark',
  getHighlighter,
  onVisitLine(node) {
    // Prevent lines from collapsing in `display: grid` mode, and allow empty
    // lines to be copy/pasted
    if (node.children.length === 0) {
      node.children = [{ type: 'text', value: ' ' }]
    }
  },
  onVisitHighlightedLine(node) {
    node.properties.className = [
      ...(node.properties.className ?? []),
      'line--highlighted',
    ]
  },
  onVisitHighlightedChars(node) {
    node.properties.className = ['word--highlighted']
    node.tagName = 'span'
  },
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
    alpinejs({ entrypoint: '/src/entrypoints/alpine' }),
  ],
  markdown: {
    syntaxHighlight: false,
    remarkPlugins: [codeImport],
    rehypePlugins: [
      rehypeSlug,
      rehypeComponent,
      () => (tree) => {
        visit(tree, (node) => {
          if (node?.type === 'element' && node?.tagName === 'pre') {
            const [codeEl] = node.children
            if (codeEl.tagName !== 'code') {
              return
            }

            if (codeEl.data?.meta) {
              // Extract event from meta and pass it down the tree.
              const regex = /event="([^"]*)"/
              const match = codeEl.data?.meta.match(regex)
              if (match) {
                node.__event__ = match ? match[1] : null
                codeEl.data.meta = codeEl.data.meta.replace(regex, '')
              }
            }

            node.__rawString__ = codeEl.children?.[0].value
            node.__src__ = node.properties?.__src__
            node.__style__ = node.properties?.__style__
            node.slot = node.properties?.slot
          }
        })
      },
      [
        rehypePrettyCode,
        optionsRehypePrettyCode,
      ],
      () => (tree) => {
        visit(tree, (node) => {
          if (node?.type === 'element' && node?.tagName === 'figure') {
            if (!('data-rehype-pretty-code-figure' in node.properties)) {
              return
            }

            const preElement = node.children.at(-1)
            if (preElement.tagName !== 'pre') {
              return
            }

            preElement.properties.__withMeta__
              = node.children.at(0).tagName === 'figcaption'

            preElement.properties.__rawString__ = node.__rawString__

            if (node.__src__) {
              preElement.properties.__src__ = node.__src__
            }

            if (node.__event__) {
              preElement.properties.__event__ = node.__event__
            }

            if (node.__style__) {
              preElement.properties.__style__ = node.__style__
            }

            if (node.slot) {
              preElement.properties.slot = node.slot
            }
          }
        })
      },
      rehypeNpmCommand,
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ['subheading-anchor'],
            ariaLabel: 'Link to section',
          },
        },
      ],
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
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  },
})
