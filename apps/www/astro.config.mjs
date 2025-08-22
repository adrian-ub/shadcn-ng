import analogjsangular from '@analogjs/astro-angular'

import mdx from '@astrojs/mdx'

import tailwindcss from '@tailwindcss/vite'

// @ts-check
import { defineConfig, fontProviders } from 'astro/config'

import Icons from 'unplugin-icons/vite'

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), analogjsangular()],
  vite: {
    plugins: [
      tailwindcss(),
      Icons({
        compiler: 'astro',
      }),
    ],
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
