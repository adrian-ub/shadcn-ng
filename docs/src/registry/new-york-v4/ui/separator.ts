import { computed, Directive, input } from '@angular/core'

import { RdxSeparatorRootDirective } from '@radix-ng/primitives/separator'

import { cn } from '~/lib/utils'

export const separatorClass = 'bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px'

@Directive({
  standalone: true,
  selector: '[ubSeparator]',
  hostDirectives: [
    {
      directive: RdxSeparatorRootDirective,
      inputs: ['orientation', 'decorative'],
    },
  ],
  host: {
    '[class]': 'computedClass()',
    'data-slot': 'separator',
  },
})
export class UbSeparator {
  readonly class = input<string>()

  protected computedClass = computed(() =>
    cn(separatorClass, this.class()),
  )
}
