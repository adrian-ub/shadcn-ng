import { computed, Directive, input } from '@angular/core'

import { RdxSeparatorRootDirective } from '@radix-ng/primitives/separator'

import { cn } from '~/lib/utils'

@Directive({
  standalone: true,
  selector: '[ubSeperator]',
  hostDirectives: [
    {
      directive: RdxSeparatorRootDirective,
      inputs: ['orientation', 'decorative'],
    },
  ],
  host: {
    '[class]': 'computedClass()',
  },
})
export class UbSeparatorDirective {
  readonly class = input<string>()

  protected computedClass = computed(() =>
    cn(
      'bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
      this.class(),
    ),
  )
}
