export const iconLibraries = {
  lucide: {
    name: '@ngxi/lucide',
    package: '@ngxi/lucide',
    import: '@ngxi/lucide',
  },
  radix: {
    name: '@ngxi/radix-icons',
    package: '@ngxi/radix-icons',
    import: '@ngxi/radix-icons',
  },
} as const

export const icons: Record<
  string,
  Record<keyof typeof iconLibraries, string>
> = {}
