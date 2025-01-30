import { availableColors, colorMapping, colorsData } from '@/registry/registry-colors'

export async function getStaticPaths(): Promise<{ params: { theme: string } }[]> {
  return availableColors.map(color => ({
    params: { theme: color },
  }))
}

export async function GET({ params }: { params: { theme: string } }): Promise<Response> {
  const baseColor = params.theme
  const payload: Record<string, any> = {
    name: baseColor,
    label: baseColor.charAt(0).toUpperCase() + baseColor.slice(1),
    cssVars: {},
  }

  for (const [mode, values] of Object.entries(colorMapping)) {
    payload.cssVars[mode] = {}
    for (const [key, value] of Object.entries(values)) {
      if (typeof value === 'string') {
        const resolvedColor = value.replace(/\{\{base\}\}-/g, `${baseColor}-`)
        payload.cssVars[mode][key] = resolvedColor

        const [resolvedBase, scale] = resolvedColor.split('-')
        const color = scale
          ? colorsData()[resolvedBase].find(
              (item: any) => item.scale === Number.parseInt(scale),
            )
          : colorsData()[resolvedBase]
        if (color) {
          payload.cssVars[mode][key] = color.hslChannel
        }
      }
    }
  }

  return new Response(JSON.stringify(payload, null, 2))
}
