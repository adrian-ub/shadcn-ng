import { Directive } from '@angular/core'

import { RdxAspectRatioDirective } from '@radix-ng/primitives/aspect-ratio'

@Directive({
  standalone: true,
  selector: '[ubAspectRatio]',
  hostDirectives: [
    {
      directive: RdxAspectRatioDirective,
      inputs: ['ratio'],
    },
  ],
})
export class UbAspectRatioDirective { }
