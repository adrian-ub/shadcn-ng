import { cn } from '@/lib/utils'
import { Component, computed, input } from '@angular/core'

import { RdxSwitchRootDirective, RdxSwitchThumbDirective } from '@radix-ng/primitives/switch'

@Component({
  standalone: true,
  selector: 'button[ubSwitch]',
  imports: [RdxSwitchThumbDirective],
  hostDirectives: [
    {
      directive: RdxSwitchRootDirective,
      inputs: ['id', 'required', 'checked', 'disabled'],
      outputs: ['onCheckedChange'],
    },
  ],
  host: {
    '[class]': 'computedClass()',
  },
  template: `
    <span rdxSwitchThumb class="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"></span>
    `,
})
export class SwitchDirective {
  readonly class = input<string>()
  readonly computedClass = computed(() => {
    return cn('peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input', this.class())
  })
}
