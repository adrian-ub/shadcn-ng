export const iconLibraries = {
  lucide: {
    name: '@ng-icons/lucide',
    package: '@ng-icons/lucide',
    import: '@ng-icons/lucide',
  },
  radix: {
    name: '@ng-icons/radix-icons',
    package: '@ng-icons/radix-icons',
    import: '@ng-icons/radix-icons',
  },
} as const

export const icons: Record<
  string,
  Record<keyof typeof iconLibraries, string>
> = {}
