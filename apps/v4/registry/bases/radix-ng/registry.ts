import type { Registry } from 'shadcn-ng/registry'

// @radix-ng base — Angular components built on @radix-ng/primitives
// Following shadcn/ui multi-base pattern with Angular-first design.

export const registry = {
  name: 'shadcn-ng',
  homepage: 'https://github.com/adrian-ub/shadcn-ng',
  items: [
    {
      name: 'index',
      type: 'registry:style',
      dependencies: [
        'class-variance-authority',
        '@ng-icons/core',
        '@ng-icons/lucide',
        'tailwindcss-animate',
      ],
      registryDependencies: ['utils'],
      cssVars: {},
      files: [],
    },
  ],
} satisfies Registry
