import { Component, computed, input, numberAttribute } from '@angular/core'
import { RdxProgressIndicatorDirective, RdxProgressRootDirective } from '@radix-ng/primitives/progress'

import { cn } from '~/lib/utils'

@Component({
  standalone: true,
  selector: '[ubProgress]',
  imports: [RdxProgressIndicatorDirective],
  host: {
    '[class]': 'computedClass()',
  },
  hostDirectives: [
    {
      directive: RdxProgressRootDirective,
      inputs: ['rdxValue:progress', 'rdxMax:max', 'rdxValueLabel:valueLabel'],
    },
  ],
  template: `
    <div rdxProgressIndicator class="h-full w-full flex-1 bg-primary transition-all" [style.transform]="'translateX(-' + (100 - (progress() || 0)) + '%)'"></div>
  `,
})
export class ProgressDirective {
  progress = input(0, {
    transform: numberAttribute,
  })

  class = input<string>()
  computedClass = computed(() => cn('relative h-2 w-full overflow-hidden rounded-full bg-primary/20', this.class()))
}
