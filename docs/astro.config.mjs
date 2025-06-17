import analogjsangular from '@analogjs/astro-angular'
import starlight from '@astrojs/starlight'
import tailwindcss from '@tailwindcss/vite'

// @ts-check
import { defineConfig, fontProviders } from 'astro/config'

const angularComponentsPaths = [
  'src/components',
  'src/registry',
]

// https://astro.build/config
export default defineConfig({
  integrations: [
    analogjsangular({
      vite: {
        transformFilter: (_code, id) => {
          return angularComponentsPaths.some(path => id.includes(path))
        },
      },
    }),
    starlight({
      title: 'shadcn-ng',
      titleDelimiter: '-',
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/adrian-ub/shadcn-ng' }],
      sidebar: [
        {
          label: 'Get Started',
          items: [
            {
              label: 'Installation',
              slug: 'docs/installation',
            },
          ],
        },
      ],
      customCss: ['./src/styles/global.css'],
      components: {
        PageFrame: './src/components/starlight/PageFrame.astro',
        Head: './src/components/starlight/Head.astro',
        Hero: './src/components/starlight/Hero.astro',
        ThemeSelect: './src/components/starlight/ThemeSelect.astro',
        TwoColumnContent: './src/components/starlight/TwoColumnContent.astro',
        Sidebar: './src/components/starlight/Sidebar.astro',
        ContentPanel: './src/components/starlight/ContentPanel.astro',
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
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
