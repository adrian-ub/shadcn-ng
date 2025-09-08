/// <reference types="vitest" />

import analog from '@analogjs/platform'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import { getOgRoutesFromDocs, getRoutesFromDocs } from './lib/routes/docs'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  build: {
    target: ['es2020'],
  },
  resolve: {
    mainFields: ['module'],
  },
  plugins: [
    viteTsConfigPaths(),
    analog({
      static: true,
      content: {
        highlighter: 'shiki',
      },
      prerender: {
        routes: async () => [
          '/',
          ...getRoutesFromDocs(),
          ...getOgRoutesFromDocs(),
        ],
      },
      nitro: {
        hooks: {
          'prerender:generate': (route: any) => {
            if (route.route.startsWith('/api/v1/og')) {
              route.route = route.route.split('?')[0].replace('/api/v1', '')
              route.fileName = route.fileName?.split('?')[0].replace('/api/v1', '')
            }
          },
        },
      },
    }),
    tailwindcss(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['**/*.spec.ts'],
    reporters: ['default'],
  },
  define: {
    'import.meta.vitest': mode !== 'production',
  },
}))
