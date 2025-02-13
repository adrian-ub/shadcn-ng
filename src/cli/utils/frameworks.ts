export const FRAMEWORKS = {
  angular: {
    name: 'angular',
    label: 'Angular',
    links: {
      installation: 'https://ui.adrianub.dev/docs/installation/angular',
      tailwind: 'https://tailwindcss.com/docs/installation/framework-guides/angular',
    },
  },
  vite: {
    name: 'vite',
    label: 'Vite',
    links: {
      installation: 'https://ui.adrianub.dev/docs/installation/vite',
      tailwind: 'https://tailwindcss.com/docs/installation/using-vite',
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
}

export type Framework = (typeof FRAMEWORKS)[keyof typeof FRAMEWORKS]
