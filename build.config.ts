import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
    { input: 'src/cli/index', name: 'cli' },
    'src/registry',
  ],
  declaration: true,
  clean: true,
})
