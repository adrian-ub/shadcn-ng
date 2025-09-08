import { Component } from '@angular/core'
import { ColorPalette } from '@/components/color-palette'
import { getColors } from '@/lib/colors'

@Component({
  selector: 'app-colors',
  imports: [ColorPalette],
  template: `
  <div class="grid gap-8 lg:gap-16 xl:gap-20">
    @for (colorPalette of colors; track $index) {
      <color-palette [colorPalette]="colorPalette"></color-palette>
    }
  </div>
  `,
})
export default class ColorsPage {
  protected readonly colors = getColors()
}
