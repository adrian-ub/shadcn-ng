import type { Registry } from 'shadcn-ng/schema'

/// keep-sorted {"keys": ["name", "type", "dependencies","registryDependencies","files"]}
export const examples: Registry['items'] = [
  {
    name: 'accordion-demo',
    type: 'registry:example',
    dependencies: [],
    registryDependencies: [],
    files: [
      {
        type: 'registry:example',
        path: 'examples/accordion-demo.ts',
      },
    ],
  },
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
