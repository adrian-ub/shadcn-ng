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
  {
    name: 'alert',
    type: 'registry:ui',
    files: ['ui/alert.ts'],
  },
  {
    name: 'aspect-ratio',
    type: 'registry:ui',
    dependencies: ['@radix-ng/primitives'],
    files: ['ui/aspect-ratio.ts'],
  },
  {
    name: 'avatar',
    type: 'registry:ui',
    dependencies: ['@radix-ng/primitives'],
    files: ['ui/avatar.ts'],
  },
  {
    name: 'badge',
    type: 'registry:ui',
    files: ['ui/badge.ts'],
  },
  {
    name: 'breadcrumb',
    type: 'registry:ui',
    files: ['ui/breadcrumb.ts'],
  },
  {
    name: 'button',
    type: 'registry:ui',
    files: ['ui/button.ts'],
  },
  {
    name: 'card',
    type: 'registry:ui',
    files: ['ui/card.ts'],
  },
  {
    name: 'collapsible',
    type: 'registry:ui',
    dependencies: ['@radix-ng/primitives'],
    files: ['ui/collapsible.ts'],
  },
  {
    name: 'dialog',
    type: 'registry:ui',
    dependencies: ['@radix-ng/primitives', '@ng-icons/core', '@ng-icons/lucide'],
    files: ['ui/dialog.ts'],
  },
  {
    name: 'input',
    type: 'registry:ui',
    files: ['ui/input.ts'],
  },
  {
    name: 'label',
    type: 'registry:ui',
    dependencies: ['@radix-ng/primitives'],
    files: ['ui/label.ts'],
  },
  {
    name: 'separator',
    type: 'registry:ui',
    files: ['ui/separator.ts'],
  },
  {
    name: 'skeleton',
    type: 'registry:ui',
    files: ['ui/skeleton.ts'],
  },
  {
    name: 'sonner',
    type: 'registry:ui',
    dependencies: ['ngx-sonner'],
    files: ['ui/sonner.ts'],
  },
  {
    name: 'switch',
    type: 'registry:ui',
    dependencies: ['@radix-ng/primitives'],
    files: ['ui/switch.ts'],
  },
  {
    name: 'table',
    type: 'registry:ui',
    files: ['ui/table.ts'],
  },
  {
    name: 'tabs',
    type: 'registry:ui',
    dependencies: ['@radix-ng/primitives'],
    files: ['ui/tabs.ts'],
  },
]
