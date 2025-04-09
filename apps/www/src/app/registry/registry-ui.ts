import type { Registry } from 'shadcn-ng/registry'

export const ui: Registry['items'] = [
  {
    name: 'accordion',
    type: 'registry:ui',
    dependencies: ['@radix-ng/primitives'],
    files: [{ path: 'ui/accordion.ts', type: 'registry:ui' }],
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
    files: [{ path: 'ui/alert.ts', type: 'registry:ui' }],
  },
  {
    name: 'aspect-ratio',
    type: 'registry:ui',
    dependencies: ['@radix-ng/primitives'],
    files: [{ path: 'ui/aspect-ratio.ts', type: 'registry:ui' }],
  },
  {
    name: 'avatar',
    type: 'registry:ui',
    dependencies: ['@radix-ng/primitives'],
    files: [{ path: 'ui/avatar.ts', type: 'registry:ui' }],
  },
  {
    name: 'badge',
    type: 'registry:ui',
    files: [{ path: 'ui/badge.ts', type: 'registry:ui' }],
  },
  {
    name: 'breadcrumb',
    type: 'registry:ui',
    files: [{ path: 'ui/breadcrumb.ts', type: 'registry:ui' }],
  },
  {
    name: 'button',
    type: 'registry:ui',
    files: [{ path: 'ui/button.ts', type: 'registry:ui' }],
  },
  {
    name: 'card',
    type: 'registry:ui',
    files: [{ path: 'ui/card.ts', type: 'registry:ui' }],
  },
  {
    name: 'collapsible',
    type: 'registry:ui',
    dependencies: ['@radix-ng/primitives'],
    files: [{ path: 'ui/collapsible.ts', type: 'registry:ui' }],
  },
  {
    name: 'dialog',
    type: 'registry:ui',
    dependencies: ['@radix-ng/primitives'],
    files: [{ path: 'ui/dialog.ts', type: 'registry:ui' }],
  },
  {
    name: 'dropdown-menu',
    type: 'registry:ui',
    dependencies: ['@radix-ng/primitives'],
    files: [{ path: 'ui/dropdown-menu.ts', type: 'registry:ui' }],
  },
  {
    name: 'input',
    type: 'registry:ui',
    files: [{ path: 'ui/input.ts', type: 'registry:ui' }],
  },
  {
    name: 'label',
    type: 'registry:ui',
    dependencies: ['@radix-ng/primitives'],
    files: [{ path: 'ui/label.ts', type: 'registry:ui' }],
  },
  {
    name: 'pagination',
    type: 'registry:ui',
    files: [{ path: 'ui/pagination.ts', type: 'registry:ui' }],
  },
  {
    name: 'progress',
    type: 'registry:ui',
    dependencies: ['@radix-ng/primitives'],
    files: [{ path: 'ui/progress.ts', type: 'registry:ui' }],
  },
  {
    name: 'separator',
    type: 'registry:ui',
    files: [{ path: 'ui/separator.ts', type: 'registry:ui' }],
  },
  {
    name: 'skeleton',
    type: 'registry:ui',
    files: [{ path: 'ui/skeleton.ts', type: 'registry:ui' }],
  },
  {
    name: 'sonner',
    type: 'registry:ui',
    dependencies: ['ngx-sonner'],
    files: [{ path: 'ui/sonner.ts', type: 'registry:ui' }],
  },
  {
    name: 'switch',
    type: 'registry:ui',
    dependencies: ['@radix-ng/primitives'],
    files: [{ path: 'ui/switch.ts', type: 'registry:ui' }],
  },
  {
    name: 'table',
    type: 'registry:ui',
    files: [{ path: 'ui/table.ts', type: 'registry:ui' }],
  },
  {
    name: 'tabs',
    type: 'registry:ui',
    dependencies: ['@radix-ng/primitives'],
    files: [{ path: 'ui/tabs.ts', type: 'registry:ui' }],
  },
  {
    name: 'textarea',
    type: 'registry:ui',
    files: [{ path: 'ui/textarea.ts', type: 'registry:ui' }],
  },
  {
    name: 'toggle',
    type: 'registry:ui',
    dependencies: ['@radix-ng/primitives'],
    files: [{ path: 'ui/toggle.ts', type: 'registry:ui' }],
  },
]
