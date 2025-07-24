import { computed, Directive, input } from '@angular/core'

import { RdxLabelDirective } from '@radix-ng/primitives/label'

import { cn } from '~/lib/utils'

@Directive({
  selector: '[ubLabel]',
  standalone: true,
  hostDirectives: [
    {
      directive: RdxLabelDirective,
      inputs: ['htmlFor', 'id'],
    },
  ],
  host: {
    '[class]': 'computedClass()',
    'data-slot': 'label',
  },
})
export class UbLabel {
  readonly class = input<string>('')
  protected computedClass = computed(() => cn('flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50', this.class()))
}
