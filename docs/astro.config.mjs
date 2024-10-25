import angular from '@analogjs/astro-angular'
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
import { rehypeNpmCommand } from './plugins/rehype-npm-command'
import { siteConfig } from './src/config/site'

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
    syntaxHighlight: false,
    remarkPlugins: [codeImport],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
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
          onVisitHighlightedWord(node) {
            node.properties.className = ['word--highlighted']
          },
        },
      ],
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

            const rawString = extractText(codeEl)
            node.properties = node.properties || {}
            node.properties.__rawString__ = rawString
          }
        })
      },
      () => (tree) => {
        visit(tree, (node) => {
          if (node?.type === 'element' && node?.tagName === 'div') {
            if (!('data-rehype-pretty-code-fragment' in node.properties)) {
              return
            }

            const preElement = node.children.at(-1)
            if (preElement.tagName !== 'pre') {
              return
            }

            preElement.properties.__withMeta__
              = node.children.at(0).tagName === 'div'
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
  },
})
