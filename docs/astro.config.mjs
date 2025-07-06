import path from 'node:path'
import { fileURLToPath } from 'node:url'
import analogjsangular from '@analogjs/astro-angular'
import mdx from '@astrojs/mdx'
import tailwindcss from '@tailwindcss/vite'
// @ts-check
import { defineConfig, fontProviders } from 'astro/config'

import rehypePrettyCode from 'rehype-pretty-code'
import Icons from 'unplugin-icons/vite'

import { transformers } from './src/lib/highlight-code'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// https://astro.build/config
export default defineConfig({
  integrations: [analogjsangular(), mdx()],
  markdown: {
    syntaxHighlight: false,
    rehypePlugins: [
      [
        rehypePrettyCode,
        {
          theme: {
            dark: 'github-dark',
            light: 'github-light-default',
          },
          transformers,
        },
      ],
    ],
  },
  vite: {
    plugins: [
      tailwindcss(),
      Icons({
        compiler: 'astro',
      }),
    ],
    optimizeDeps: {
      include: [
        '@radix-ng/primitives',
        '@angular/common',
        '@angular/core',
        '@angular/cdk',
        '@ngxi/lucide',
        '@internationalized/date',
        'clsx',
        'tailwind-merge',
        'class-variance-authority',
      ],
    },
    ssr: {
      noExternal: [
        '@radix-ng/primitives/**',
        '@angular/common',
        '@angular/core',
        '@angular/core/rxjs-interop',
        '@ngxi/lucide',
        '@internationalized/date',
      ],
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },

  },
  experimental: {
    fonts: [
      {
        provider: fontProviders.google(),
        name: 'Geist',
        cssVariable: '--font-sans',
        subsets: ['latin'],
        weights: ['100 900'],
      },
      {
        provider: fontProviders.google(),
        name: 'Geist Mono',
        cssVariable: '--font-mono',
        subsets: ['latin'],
        weights: ['400'],
      },
      {
        provider: fontProviders.google(),
        name: 'Inter',
        cssVariable: '--font-inter',
        subsets: ['latin'],
        weights: ['100 900'],
      },
    ],
  },
})
