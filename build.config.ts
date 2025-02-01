import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
    'src/cli',
    'src/registry',
  ],
  declaration: true,
  clean: true,
})
