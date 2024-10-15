export const FRAMEWORKS = {
  angular: {
    name: 'angular',
    label: 'Angular',
    links: {
      installation: 'https://ui.adrianub.dev/docs/installation/angular',
      tailwind: 'https://tailwindcss.com/docs/guides/angular',
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
