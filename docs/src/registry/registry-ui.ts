import type { Registry } from 'shadcn-ng/registry'

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
    name: 'button',
    type: 'registry:ui',
    files: [
      {
        path: 'ui/button.ts',
        type: 'registry:ui',
      },
    ],
  },
  {
    name: 'separator',
    type: 'registry:ui',
    files: [
      {
        path: 'ui/separator.ts',
        type: 'registry:ui',
      },
    ],
  },
]
