import type { Registry } from './schema'

export const ui: Registry = [
  {
    name: 'accordion',
    type: 'components:ui',
    dependencies: ['@ng-icons/core', '@ng-icons/lucide', '@radix-ng/primitives'],
    files: ['ui/accordion.ts'],
  },
  {
    name: 'alert',
    type: 'components:ui',
    files: ['ui/alert.ts'],
  },
  {
    name: 'avatar',
    type: 'components:ui',
    dependencies: ['@radix-ng/primitives'],
    files: ['ui/avatar.ts'],
  },
  {
    name: 'badge',
    type: 'components:ui',
    files: ['ui/badge.ts'],
  },
  {
    name: 'breadcrumb',
    type: 'components:ui',
    files: ['ui/breadcrumb.ts'],
    dependencies: ['@ng-icons/core', '@ng-icons/radix-icons'],
  },
  {
    name: 'button',
    type: 'components:ui',
    files: ['ui/button.ts'],
  },
  {
    name: 'card',
    type: 'components:ui',
    files: ['ui/card.ts'],
  },
  {
    name: 'input',
    type: 'components:ui',
    files: ['ui/input.ts'],
  },
  {
    name: 'label',
    type: 'components:ui',
    dependencies: ['@radix-ng/primitives'],
    files: ['ui/label.ts'],
  },
  {
    name: 'separator',
    type: 'components:ui',
    files: ['ui/separator.ts'],
  },
  {
    name: 'skeleton',
    type: 'components:ui',
    files: ['ui/skeleton.ts'],
  },
  {
    name: 'switch',
    type: 'components:ui',
    dependencies: ['@radix-ng/primitives'],
    files: ['ui/switch.ts'],
  },
  {
    name: 'table',
    type: 'components:ui',
    files: ['ui/table.ts'],
  },
  {
    name: 'tabs',
    type: 'components:ui',
    dependencies: ['@angular/cdk', '@radix-ng/primitives'],
    files: ['ui/tabs.ts'],
  },
]
