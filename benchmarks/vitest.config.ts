import codspeedPlugin from '@codspeed/vitest-plugin'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  // @ts-expect-error CodSpeed types target Vite 6; Vitest 2 exposes Vite 5 types.
  plugins: [codspeedPlugin()],
  test: {
    include: ['benchmarks/**/*.bench.ts'],
    benchmark: {
      include: ['benchmarks/**/*.bench.ts'],
    },
  },
})
