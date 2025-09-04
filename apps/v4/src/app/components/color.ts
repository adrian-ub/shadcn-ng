import type { Color as ColorType } from '@/lib/colors'
import { Component, input } from '@angular/core'

@Component({
  selector: 'color',
  host: {
    'class': 'group relative flex aspect-[3/1] w-full flex-1 cursor-pointer flex-col gap-2 text-(--text) sm:aspect-[2/3] sm:h-auto sm:w-auto [&>svg]:absolute [&>svg]:top-4 [&>svg]:right-4 [&>svg]:z-10 [&>svg]:h-3.5 [&>svg]:w-3.5 [&>svg]:opacity-0 [&>svg]:transition-opacity',
    '[style]': '{ \'--bg\': color().oklch, \'--text\': color().foreground }',
  },
  template: `
    <div class="border-ghost after:border-input w-full flex-1 rounded-md bg-(--bg) after:rounded-lg md:rounded-lg"></div>
    <div class="flex w-full flex-col items-center justify-center gap-1">
      <span class="text-muted-foreground group-hover:text-foreground group-data-[last-copied=true]:text-primary font-mono text-xs tabular-nums transition-colors sm:hidden xl:flex">
        {{color().className}}
      </span>
      <span class="text-muted-foreground group-hover:text-foreground group-data-[last-copied=true]:text-primary hidden font-mono text-xs tabular-nums transition-colors sm:flex xl:hidden">
        {{color().scale}}
      </span>
    </div>
  `,
})
export class Color {
  readonly color = input.required<ColorType>()
}
