import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    cli: 'src/cli/index.ts',
    registry: 'src/registry/index.ts',
  },
  format: 'esm',
  dts: true,
  clean: true,
  platform: 'node',
  target: 'node20',
})
