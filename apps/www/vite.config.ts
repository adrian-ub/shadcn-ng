/// <reference types="vitest" />

import analog from '@analogjs/platform'
import { defineConfig } from 'vite'
import viteTsConfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig(() => ({
  build: {
    target: ['es2020'],
  },
  resolve: {
    mainFields: ['module'],
  },
  plugins: [
    analog({
      ssr: false,
      static: true,
      prerender: {
        routes: [],
      },
    }),
    viteTsConfigPaths(),
  ],
}))
