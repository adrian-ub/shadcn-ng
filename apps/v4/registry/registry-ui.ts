import type { Registry } from 'shadcn-ng/schema'

/// keep-sorted {"keys": ["name", "type", "dependencies","registryDependencies","files", "tailwind"]}
export const ui: Registry['items'] = [
  {
    name: 'accordion',
    type: 'registry:ui',
    files: [
      {
        path: 'ui/accordion.ts',
        type: 'registry:ui',
      },
    ],
  },
  {
    name: 'alert',
    type: 'registry:ui',
    files: [
      {
        path: 'ui/alert.ts',
        type: 'registry:ui',
      },
    ],
  },
  {
    name: 'aspect-ratio',
    type: 'registry:ui',
    files: [
      {
        path: 'ui/aspect-ratio.ts',
        type: 'registry:ui',
      },
    ],
  },
  {
    name: 'avatar',
    type: 'registry:ui',
    dependencies: [],
    registryDependencies: [],
    files: [
      {
        path: 'ui/avatar.ts',
        type: 'registry:ui',
      },
    ],
  },
  {
    name: 'badge',
    type: 'registry:ui',
    files: [
      {
        path: 'ui/badge.ts',
        type: 'registry:ui',
      },
    ],
  },
  {
    name: 'button',
    type: 'registry:ui',
    files: [
      {
        path: 'ui/button.ts',
        type: 'registry:ui',
      },
    ],
  },
]
