export const FRAMEWORKS = {
  angular: {
    name: 'angular',
    label: 'Angular',
    links: {
      installation: 'https://ui.adrianub.dev/docs/installation/angular',
      tailwind: 'https://tailwindcss.com/docs/guides/angular',
    },
  },
  vite: {
    name: 'vite',
    label: 'Vite',
    links: {
      installation: 'https://ui.adrianub.dev/docs/installation/vite',
      tailwind: 'https://tailwindcss.com/docs/guides/vite',
    },
  },
  astro: {
    name: 'astro',
    label: 'Astro',
    links: {
      installation: 'https://ui.adrianub.dev/docs/installation/astro',
      tailwind: 'https://tailwindcss.com/docs/guides/astro',
    },
  },
  manual: {
    name: 'manual',
    label: 'Manual',
    links: {
      installation: 'https://ui.adrianub.dev/docs/installation/manual',
      tailwind: 'https://tailwindcss.com/docs/installation',
    },
  },
} as const

export type Framework = (typeof FRAMEWORKS)[keyof typeof FRAMEWORKS]
