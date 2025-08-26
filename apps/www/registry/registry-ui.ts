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
