export const examples: Record<string, Record<string, any>> = {}

const components = import.meta.glob(`../registry/**/example/*.ts`)

for (const path in components) {
  const component = components[path]
  const name = path.split('/')[2]
  const componentName = path.split('/').pop()?.replace('.ts', '')
  if (!componentName || !name) {
    continue
  }

  if (!examples[name]) {
    examples[name] = {}
  }

  examples[name][componentName] = {
    name: componentName,
    type: 'registry:example',
    registryDependencies: [name],
    files: [path],
    component,
    source: '',
    category: 'undefined',
    subcategory: 'undefined',
    chunks: [],
  }
}
