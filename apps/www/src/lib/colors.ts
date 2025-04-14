import { colors } from '@/registry/registry-colors'

import * as v from 'valibot'

const colorSchema = v.object({
  name: v.string(),
  id: v.string(),
  scale: v.number(),
  class: v.string(),
  hex: v.string(),
  rgb: v.string(),
  hsl: v.string(),
  foreground: v.string(),
  oklch: v.string(),
})

const colorPaletteSchema = v.object({
  name: v.string(),
  colors: v.array(colorSchema),
})

export type ColorPalette = v.InferOutput<typeof colorPaletteSchema>

export function getColorFormat(color: Color): { class: string, hex: string, rgb: string, hsl: string, oklch: string } {
  return {
    class: `bg-${color.name}-100`,
    hex: color.hex,
    rgb: color.rgb,
    hsl: color.hsl,
    oklch: color.oklch,
  }
}

export type ColorFormat = keyof ReturnType<typeof getColorFormat>

export function getColors(): ColorPalette[] {
  const tailwindColors = v.parse(v.array(colorPaletteSchema), Object.entries(colors)
    .map(([name, color]) => {
      if (!Array.isArray(color)) {
        return null
      }

      return {
        name,
        colors: color.map((color) => {
          const rgb = color.rgb.replace(
            /^rgb\((\d+),(\d+),(\d+)\)$/,
            '$1 $2 $3',
          )

          return {
            ...color,
            name,
            id: `${name}-${color.scale}`,
            class: `${name}-${color.scale}`,
            rgb,
            hsl: color.hsl.replace(
              /^hsl\(([\d.]+),([\d.]+%),([\d.]+%)\)$/,
              '$1 $2 $3',
            ),
            oklch: color.oklch.replace(
              /^oklch\(([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\)$/,
              '$1 $2 $3',
            ),
            foreground: getForegroundFromBackground(rgb),
          }
        }),
      }
    })
    .filter(Boolean))

  return tailwindColors
}

export type Color = ReturnType<typeof getColors>[number]['colors'][number]

function getForegroundFromBackground(rgb: string): '#000' | '#fff' {
  const [r, g, b] = rgb.split(' ').map(Number)

  function toLinear(number: number): number {
    const base = number / 255
    return base <= 0.04045
      ? base / 12.92
      : ((base + 0.055) / 1.055) ** 2.4
  }

  const luminance
    = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)

  return luminance > 0.179 ? '#000' : '#fff'
}
