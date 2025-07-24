import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/registry/index.ts',
  ],
  fixedExtension: true,
})
