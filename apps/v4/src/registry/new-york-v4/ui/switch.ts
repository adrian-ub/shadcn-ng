import { Component, computed, input } from '@angular/core'
import { RdxSwitchRootDirective, RdxSwitchThumbDirective } from '@radix-ng/primitives/switch'

import { cn } from '~/lib/utils'

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
    <span rdxSwitchThumb class="pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"></span>
    `,
})
export class SwitchDirective {
  readonly class = input<string>()
  readonly computedClass = computed(() => {
    return cn('peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input', this.class())
  })
}
