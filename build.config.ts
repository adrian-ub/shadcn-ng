import { fileURLToPath } from 'node:url'
import { defineBuildConfig } from 'unbuild'

const fromRoot = (path: string) => fileURLToPath(new URL(path, import.meta.url))

export default defineBuildConfig({
  entries: [
    'src/index',
    'src/registry',
  ],
  declaration: true,
  clean: true,
  alias: {
    '@ng/shared': fromRoot('./packages/shared/src/index.ts'),
    '@ng/core': fromRoot('./packages/core/src/index.ts'),
    '@ng/registry-builder': fromRoot('./packages/registry-builder/src/index.ts'),
    '@ng/fixtures': fromRoot('./packages/fixtures/src/index.ts'),
  },
})
