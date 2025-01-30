import { availableColors, colorMapping, colorsData } from '@/registry/registry-colors'
import template from 'lodash.template'

const BASE_STYLES = `@tailwind base;
@tailwind components;
@tailwind utilities;
  `

const BASE_STYLES_WITH_VARIABLES = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: <%- colors.light["background"] %>;
    --foreground: <%- colors.light["foreground"] %>;
    --card: <%- colors.light["card"] %>;
    --card-foreground: <%- colors.light["card-foreground"] %>;
    --popover: <%- colors.light["popover"] %>;
    --popover-foreground: <%- colors.light["popover-foreground"] %>;
    --primary: <%- colors.light["primary"] %>;
    --primary-foreground: <%- colors.light["primary-foreground"] %>;
    --secondary: <%- colors.light["secondary"] %>;
    --secondary-foreground: <%- colors.light["secondary-foreground"] %>;
    --muted: <%- colors.light["muted"] %>;
    --muted-foreground: <%- colors.light["muted-foreground"] %>;
    --accent: <%- colors.light["accent"] %>;
    --accent-foreground: <%- colors.light["accent-foreground"] %>;
    --destructive: <%- colors.light["destructive"] %>;
    --destructive-foreground: <%- colors.light["destructive-foreground"] %>;
    --border: <%- colors.light["border"] %>;
    --input: <%- colors.light["input"] %>;
    --ring: <%- colors.light["ring"] %>;
    --radius: 0.5rem;
    --chart-1: <%- colors.light["chart-1"] %>;
    --chart-2: <%- colors.light["chart-2"] %>;
    --chart-3: <%- colors.light["chart-3"] %>;
    --chart-4: <%- colors.light["chart-4"] %>;
    --chart-5: <%- colors.light["chart-5"] %>;
  }

  .dark {
    --background: <%- colors.dark["background"] %>;
    --foreground: <%- colors.dark["foreground"] %>;
    --card: <%- colors.dark["card"] %>;
    --card-foreground: <%- colors.dark["card-foreground"] %>;
    --popover: <%- colors.dark["popover"] %>;
    --popover-foreground: <%- colors.dark["popover-foreground"] %>;
    --primary: <%- colors.dark["primary"] %>;
    --primary-foreground: <%- colors.dark["primary-foreground"] %>;
    --secondary: <%- colors.dark["secondary"] %>;
    --secondary-foreground: <%- colors.dark["secondary-foreground"] %>;
    --muted: <%- colors.dark["muted"] %>;
    --muted-foreground: <%- colors.dark["muted-foreground"] %>;
    --accent: <%- colors.dark["accent"] %>;
    --accent-foreground: <%- colors.dark["accent-foreground"] %>;
    --destructive: <%- colors.dark["destructive"] %>;
    --destructive-foreground: <%- colors.dark["destructive-foreground"] %>;
    --border: <%- colors.dark["border"] %>;
    --input: <%- colors.dark["input"] %>;
    --ring: <%- colors.dark["ring"] %>;
    --chart-1: <%- colors.dark["chart-1"] %>;
    --chart-2: <%- colors.dark["chart-2"] %>;
    --chart-3: <%- colors.dark["chart-3"] %>;
    --chart-4: <%- colors.dark["chart-4"] %>;
    --chart-5: <%- colors.dark["chart-5"] %>;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}`

export async function getStaticPaths(): Promise<{ params: { base: string } }[]> {
  return availableColors.map(color => ({
    params: { base: color },
  }))
}

export async function GET({ params }: { params: { base: string } }): Promise<Response> {
  const baseColor = params.base
  const base: Record<string, any> = {
    inlineColors: {},
    cssVars: {},
  }

  for (const [mode, values] of Object.entries(colorMapping)) {
    base.inlineColors[mode] = {}
    base.cssVars[mode] = {}
    for (const [key, value] of Object.entries(values)) {
      if (typeof value === 'string') {
        // Chart colors do not have a 1-to-1 mapping with tailwind colors.
        if (key.startsWith('chart-')) {
          base.cssVars[mode][key] = value
          continue
        }

        const resolvedColor = value.replace(/\{\{base\}\}-/g, `${baseColor}-`)
        base.inlineColors[mode][key] = resolvedColor

        const [resolvedBase, scale] = resolvedColor.split('-')
        const color = scale
          ? colorsData()[resolvedBase].find(
              (item: any) => item.scale === Number.parseInt(scale),
            )
          : colorsData()[resolvedBase]
        if (color) {
          base.cssVars[mode][key] = color.hslChannel
        }
      }
    }
  }

  // Build css vars.
  base.inlineColorsTemplate = template(BASE_STYLES)({})
  base.cssVarsTemplate = template(BASE_STYLES_WITH_VARIABLES)({
    colors: base.cssVars,
  })

  return new Response(JSON.stringify(base, null, 2))
}
