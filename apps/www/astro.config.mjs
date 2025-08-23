import analogjsangular from '@analogjs/astro-angular'

import mdx from '@astrojs/mdx'

import tailwindcss from '@tailwindcss/vite'

// @ts-check
import { defineConfig, fontProviders } from 'astro/config'

import rehypePrettyCode from 'rehype-pretty-code'
import Icons from 'unplugin-icons/vite'

import { transformers } from './lib/highlight-code'

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), analogjsangular()],
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
        '@radix-ng/components',
        '@angular/common',
        '@angular/core',
        '@angular/cdk',
        '@internationalized/date',
        '@stackblitz/sdk',
        'classnames',
        'lucide-angular',
      ],
    },
    ssr: {
      noExternal: [
        '@radix-ng/**',
        '@angular/common',
        '@angular/core',
        '@angular/core/rxjs-interop',
        '@stackblitz/sdk',
        'classnames',
        '@internationalized/date',
        'lucide-angular',
      ],
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
