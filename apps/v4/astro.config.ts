import angular from '@analogjs/astro-angular'
import markdoc from '@astrojs/markdoc'
import starlight from '@astrojs/starlight'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, fontProviders } from 'astro/config'
import { sidebar } from './astro.sidebar'
import { devServerFileWatcher } from './config/integrations/dev-server-file-watcher'
import { siteConfig } from './lib/config'

export default defineConfig({
  integrations: [
    devServerFileWatcher([
      './config/**',
      './astro.sidebar.ts',
    ]),
    starlight({
      title: siteConfig.name,
      social: [{ icon: 'github', label: 'GitHub', href: siteConfig.links.github }],
      sidebar,
      customCss: ['./src/styles/global.css'],
      expressiveCode: {
        themes: ['github-dark', 'github-light-default'],
      },
      components: {
        Header: './src/components/starlight/Header.astro',
        PageFrame: './src/components/starlight/PageFrame.astro',
        Head: './src/components/starlight/Head.astro',
        Search: './src/components/starlight/Search.astro',
        Sidebar: './src/components/starlight/Sidebar.astro',
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
