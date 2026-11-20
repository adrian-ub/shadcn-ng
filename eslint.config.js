import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  astro: true,
  pnpm: true,
  ignores: [
    'legacy/**',
    '**/.astro',
  ],
})
