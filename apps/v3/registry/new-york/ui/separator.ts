import { computed, Directive, input } from '@angular/core'
import { cn } from '@/lib/utils'

@Directive({
  standalone: true,
  selector: '[ubSeperator]',
  host: {
    '[class]': 'computedClass()',
  },
})
export class UbSeparatorDirective {
  readonly class = input<string>()
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal')

  protected computedClass = computed(() =>
    cn(
      'shrink-0 bg-border',
      this.orientation() === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
      this.class(),
    ),
  )
}
