import analogjsangular from '@analogjs/astro-angular'
import starlight from '@astrojs/starlight'
import tailwindcss from '@tailwindcss/vite'

// @ts-check
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  integrations: [
    analogjsangular({
      vite: {
        transformFilter: (_code, id) => {
          return id.includes('src/components')
        },
      },
    }),
    starlight({
      title: 'shadcn-ng',
      titleDelimiter: '-',
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/adrian-ub/shadcn-ng' }],
      sidebar: [],
      customCss: ['./src/styles/global.css'],
      components: {
        PageFrame: './src/components/starlight/PageFrame.astro',
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
})
