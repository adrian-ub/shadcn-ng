import { availableColors, colorMapping, colorsData } from '@/registry/colors'

export async function getStaticPaths() {
  const paths = availableColors.map(color => ({
    params: { theme: color },
  }))

  return paths
}

export async function GET({ params }: { params: { theme: string } }) {
  const baseColor = params.theme

  const payload = {
    name: baseColor,
    label: baseColor.charAt(0).toUpperCase() + baseColor.slice(1),
    cssVars: {} as { [key: string]: { [key: string]: string } },
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
            (item: { scale: number }) => item.scale === Number.parseInt(scale),
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
