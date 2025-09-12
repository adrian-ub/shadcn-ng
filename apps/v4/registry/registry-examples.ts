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
    name: 'alert-demo',
    type: 'registry:example',
    dependencies: [],
    registryDependencies: [],
    files: [
      {
        type: 'registry:example',
        path: 'examples/alert-demo.ts',
      },
    ],
  },
  {
    name: 'aspect-ratio-demo',
    type: 'registry:example',
    dependencies: [],
    registryDependencies: [],
    files: [
      {
        type: 'registry:example',
        path: 'examples/aspect-ratio-demo.ts',
      },
    ],
  },
  {
    name: 'badge-demo',
    type: 'registry:example',
    dependencies: [],
    registryDependencies: [],
    files: [
      {
        type: 'registry:example',
        path: 'examples/badge-demo.ts',
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
