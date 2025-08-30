import angular from '@analogjs/astro-angular'
import markdoc from '@astrojs/markdoc'
import starlight from '@astrojs/starlight'
import tailwindcss from '@tailwindcss/vite'

import { defineConfig } from 'astro/config'
import { sidebar } from './astro.sidebar'
import { devServerFileWatcher } from './config/integrations/dev-server-file-watcher'

export default defineConfig({
  integrations: [
    devServerFileWatcher([
      './config/**',
      './astro.sidebar.ts',
    ]),
    starlight({
      title: 'shadcn-ng',
      logo: {
        src: '/src/assets/logo.svg',
      },
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/adrian-ub/shadcn-ng' }],
      sidebar,
      customCss: ['./src/styles/global.css'],
      expressiveCode: {
        themes: ['github-dark', 'github-light-default'],
      },
    }),
    angular({
      vite: {
        transformFilter: (_code, id) => {
          return id.includes('src/components') || id.includes('registry') || id.includes('lib')
        },
      },
    }),
    markdoc({
      ignoreIndentation: true,
      allowHTML: true,
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        '@radix-ng/primitives',
        '@angular/common',
        '@angular/core',
        '@angular/cdk',
        '@ngxi/lucide',
      ],
    },
    ssr: {
      noExternal: [
        '@radix-ng/primitives',
        '@angular/cdk',
        '@ngxi/lucide',
      ],
    },
  },
})
