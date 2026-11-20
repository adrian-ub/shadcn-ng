import { bench, describe } from 'vitest'

const buttonItem = {
  name: 'button',
  type: 'ng:component',
  title: 'Button',
  version: '0.1.0',
  constraints: {
    angular: '>=21 <23',
    typescript: '>=5.9 <7',
    tailwind: '3|4',
    standalone: true,
  },
  dependencies: ['@angular/cdk@^21.0.0'],
  registryDependencies: [],
  files: [
    {
      path: 'button/button.ts',
      type: 'ng:component',
      target: '@ui/button.ts',
      content: 'import { Component } from \'@angular/core\';\n',
    },
  ],
  cssVars: {
    light: { '--primary': 'oklch(0.62 0.19 260)' },
    dark: { '--primary': 'oklch(0.72 0.15 260)' },
  },
  categories: ['forms'],
}

const payload = JSON.stringify(buttonItem)

describe('registry item payload', () => {
  bench('parse button item', () => {
    JSON.parse(payload)
  })

  bench('serialize button item', () => {
    JSON.stringify(buttonItem)
  })
})
