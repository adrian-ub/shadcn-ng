import { computed, Directive, input } from '@angular/core'

import { RdxLabelDirective } from '@radix-ng/primitives/label'

import { cn } from '~/lib/utils'

@Directive({
  selector: '[ubLabel]',
  standalone: true,
  hostDirectives: [
    {
      directive: RdxLabelDirective,
      inputs: ['htmlFor'],
    },
  ],
  host: {
    '[class]': 'computedClass()',
  },
})
export class UbLabelDirective {
  readonly class = input<string>('')
  protected computedClass = computed(() => cn('text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50', this.class()))
}
