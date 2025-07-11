import antfu from '@antfu/eslint-config'

export default antfu(
  {
    type: 'lib',
    // pnpm: true,
    formatters: true,
    astro: true,
    ignores: [
      'docs/.astro',
      'docs/src/components/ModeSwitcher.astro',
      'docs/src/components/SiteConfig.astro',
      'docs/src/pages/docs',
    ],
  },
)
