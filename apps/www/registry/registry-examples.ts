import type { Registry } from 'shadcn-ng/schema'

/// keep-sorted {"keys": ["name", "type", "dependencies","registryDependencies","files"]}
export const examples: Registry['items'] = [
  {
    name: 'button-demo',
    type: 'registry:example',
    dependencies: [],
    registryDependencies: [],
    files: [
      {
        type: 'registry:example',
        path: 'examples/button-demo.ts',
      },
    ],
  },
]
