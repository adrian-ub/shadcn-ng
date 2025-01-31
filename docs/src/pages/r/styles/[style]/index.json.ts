import type { Style } from '@/registry/registry-styles'
import type { RegistryEntry } from '@/registry/schema'
import { styles } from '@/registry/registry-styles'

export async function getStaticPaths(): Promise<{ params: { style: string } }[]> {
  return styles.map(style => ({
    params: {
      style: style.name,
    },
    props: {
      style,
    },
  }))
}

const dependencies = [
  'tailwindcss-animate',
  'class-variance-authority',
  '@ng-icons/core',
  '@ng-icons/lucide',
]

export async function GET({ props: { style } }: {
  params: {
    style: string
  }
  props: {
    style: Style
  }
}): Promise<Response> {
  const payload: RegistryEntry = {
    name: style.name,
    type: 'registry:style',
    dependencies,
    registryDependencies: ['utils'],
    tailwind: {
      config: {
        plugins: [`require("tailwindcss-animate")`],
      },
    },
    cssVars: {},
    files: [],
  }

  return new Response(JSON.stringify(payload, null, 2))
}
