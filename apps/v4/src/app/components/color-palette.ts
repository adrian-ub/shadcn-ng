import type { ColorPalette as ColorPaletteType } from '@/lib/colors'
import { Component, input } from '@angular/core'
import { Color } from '@/components/color'
import { ColorFormatSelector } from '@/components/color-format-selector'

@Component({
  selector: 'color-palette',
  imports: [ColorFormatSelector, Color],
  template: `
  <div [id]="colorPalette().name" class="scroll-mt-20 rounded-lg">
    <div class="flex items-center px-4">
      <div class="flex-1 pl-1 text-sm font-medium">
        <h2 class="capitalize">{{colorPalette().name}}</h2>
      </div>
      <color-format-selector class="ml-auto" />
    </div>
    <div class="flex flex-col gap-4 py-4 sm:flex-row sm:gap-2">
      @for (color of colorPalette().colors; track $index) {
        <color [color]="color" />
      }
    </div>
  </div>
  `,
})
export class ColorPalette {
  readonly colorPalette = input.required<ColorPaletteType>()
}
