import type { Registry } from '@/registry/schema'

export const ui: Registry = [
  {
    name: 'accordion',
    type: 'registry:ui',
    dependencies: ['@ng-icons/core', '@ng-icons/lucide', '@radix-ng/primitives'],
    files: ['ui/accordion.ts'],
    tailwind: {
      config: {
        theme: {
          extend: {
            keyframes: {
              'accordion-down': {
                from: { height: '0' },
                to: { height: 'var(--radix-accordion-content-height)' },
              },
              'accordion-up': {
                from: { height: 'var(--radix-accordion-content-height)' },
                to: { height: '0' },
              },
            },
            animation: {
              'accordion-down': 'accordion-down 0.2s ease-out',
              'accordion-up': 'accordion-up 0.2s ease-out',
            },
          },
        },
      },
    },
  },
]
