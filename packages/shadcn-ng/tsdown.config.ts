import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    entry: [
      'src/index.ts',
      'src/registry/index.ts',
      'src/registry/schema.ts',
      'src/mcp/index.ts',
    ],
    platform: 'node',
    dts: true,
    format: ['esm'],
    sourcemap: true,
    minify: true,
  },
])
