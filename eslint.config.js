import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  astro: true,
  pnpm: true,
  ignores: [
    'apps/www/src/components/mdx/pre.astro',
    'apps/www/src/components/CodeBlockCommand.astro',
    '**/.astro',
  ],
})
