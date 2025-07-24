export const iconLibraries: Record<string, {
  name: string
  package: string
  import: string
}> = {} as const

export const icons: Record<
  string,
  Record<keyof typeof iconLibraries, string>
> = {}
