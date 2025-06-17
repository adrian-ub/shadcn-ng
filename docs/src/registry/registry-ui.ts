import type { Registry } from 'shadcn-ng/registry'

/// keep-sorted {"keys": ["name", "type", "dependencies","registryDependencies","files", "tailwind"]}
export const ui: Registry['items'] = [
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
