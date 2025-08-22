import { computed, Directive, input } from '@angular/core'

import { RdxLabelDirective } from '@radix-ng/primitives/label'
import { cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
)

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
  protected computedClass = computed(() => cn(labelVariants(), this.class()))
}
