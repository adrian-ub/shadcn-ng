import type { StarlightUserConfig } from '@astrojs/starlight/types'

export const sidebar: StarlightUserConfig['sidebar'] = [
  {
    label: 'Sections',
    items: [
      {
        label: 'Get Started',
        slug: 'docs',
      },
      {
        slug: 'docs/components',
      },
      {
        label: 'Registry',
        slug: 'docs/registry',
      },
      {
        slug: 'docs/mcp',
      },
    ],
  },
  {
    label: 'Get Started',
    items: [
      {
        label: 'Installation',
        slug: 'docs/installation',
      },
    ],
  },
  {
    label: 'Components',
    autogenerate: {
      directory: 'docs/components',
    },
  },
  {
    label: 'Registry',
    autogenerate: {
      directory: 'docs/registry',
    },
  },
]
