// @ts-check
import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'

import starlightThemeBlack from 'starlight-theme-black'

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'shadcn-ng',
      plugins: [
        starlightThemeBlack({
          navLinks: [
            {
              label: 'Docs',
              link: '/docs',
            },
          ],
        }),
      ],
      logo: {
        src: './src/assets/logo.svg',
      },
      titleDelimiter: '-',
      social: {
        github: 'https://github.com/adrian-ub/shadcn-ng',
      },
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            {
              label: 'Introduction',
              slug: 'docs',
            },
            {
              label: 'Installation',
              slug: 'docs/installation',
            },
          ],
        },
        {
          label: 'Installation',
          items: [
            {
              label: 'Angular',
              slug: 'docs/installation/angular',
            },
            {
              label: 'Vite',
              slug: 'docs/installation/vite',
            },
            {
              label: 'Manual',
              slug: 'docs/installation/manual',
            },
          ],
        },
      ],
    }),
  ],
})
