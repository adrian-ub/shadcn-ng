import { Directive } from '@angular/core'

import { RdxAspectRatioDirective } from '@radix-ng/primitives/aspect-ratio'

@Directive({
  standalone: true,
  selector: 'div[ubAspectRatio],ub-aspect-ratio',
  host: {
    'data-slot': 'aspect-ratio',
  },
  hostDirectives: [
    {
      directive: RdxAspectRatioDirective,
      inputs: ['ratio'],
    },
  ],
})
export class UbAspectRatio {}
