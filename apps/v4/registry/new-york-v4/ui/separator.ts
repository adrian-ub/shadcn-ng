import { booleanAttribute, computed, Directive, input } from '@angular/core'
import { RdxSeparatorRootDirective } from '@radix-ng/primitives/separator'
import { cn } from '@/lib/utils'

export const separatorClass = 'bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px'

@Directive({
  selector: '[ubSeparator]',
  hostDirectives: [
    {
      directive: RdxSeparatorRootDirective,
      inputs: ['orientation', 'decorative:decorative'],
    },
  ],
  host: {
    'data-slot': 'separator',
    '[class]': 'computedClass()',
  },
})
export class UbSeparator {
  readonly decorative = input(true, {
    transform: booleanAttribute,
  })

  readonly class = input<string>()
  protected readonly computedClass = computed(() => cn(separatorClass, this.class()))
}
