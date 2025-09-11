import angular from '@analogjs/astro-angular'
import mdx from '@astrojs/mdx'
import starlight from '@astrojs/starlight'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, fontProviders } from 'astro/config'
import rehypePrettyCode from 'rehype-pretty-code'
import Icons from 'unplugin-icons/vite'
import { sidebar } from './astro.sidebar'
import { devServerFileWatcher } from './config/integrations/dev-server-file-watcher'
import { siteConfig } from './lib/config'
import { transformers } from './lib/highlight-code'

export default defineConfig({
  trailingSlash: 'never',
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
  integrations: [
    devServerFileWatcher([
      './config/**',
      './astro.sidebar.ts',
    ]),
    starlight({
      titleDelimiter: '-',
      markdown: {
        headingLinks: false,
      },
      expressiveCode: false,
      title: siteConfig.name,
      social: [{ icon: 'github', label: 'GitHub', href: siteConfig.links.github }],
      sidebar,
      customCss: ['./src/styles/global.css'],
      components: {
        Header: './src/components/starlight/Header.astro',
        PageFrame: './src/components/starlight/PageFrame.astro',
        Head: './src/components/starlight/Head.astro',
        Search: './src/components/starlight/Search.astro',
        Sidebar: './src/components/starlight/Sidebar.astro',
        TwoColumnContent: './src/components/starlight/TwoColumnContent.astro',
        ContentPanel: './src/components/starlight/ContentPanel.astro',
        PageTitle: './src/components/starlight/PageTitle.astro',
        MarkdownContent: './src/components/starlight/MarkdownContent.astro',
        Pagination: './src/components/starlight/Pagination.astro',
        Hero: './src/components/starlight/Hero.astro',
      },
      head: [
        {
          tag: 'link',
          attrs: { rel: 'author', href: 'https://adrianub.dev' },
        },
        {
          tag: 'meta',
          attrs: { name: 'author', content: 'Adrián UB' },
        },
        {
          tag: 'meta',
          attrs: { name: 'keywords', content: 'Angular,Tailwind CSS,Components,shadcn,shadcn-ng' },
        },
        {
          tag: 'meta',
          attrs: { name: 'creator', content: 'adrianub' },
        },
      ],
    }),
    angular({
      vite: {
        transformFilter: (_code, id) => {
          return id.includes('src/components') || id.includes('registry') || id.includes('lib')
        },
      },
    }),
    mdx(),
  ],
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
        'clsx',
        'class-variance-authority',
      ],
    },
    ssr: {
      noExternal: [
        '@radix-ng/primitives',
        '@angular/cdk',
        '@ngxi/lucide',
        '@angular/cdk/**',
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
