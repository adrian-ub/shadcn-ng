import { UbAspectRatioDirective } from '@/registry/default/ui/aspect-ratio'

import { NgOptimizedImage } from '@angular/common'
import { Component } from '@angular/core'

@Component({
  standalone: true,
  selector: 'aspect-ratio-demo-default',
  imports: [UbAspectRatioDirective, NgOptimizedImage],
  template: `
  <div class="w-96">
    <div ubAspectRatio [ratio]="16 / 9" class="bg-muted">
        <img
          ngSrc="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
          alt="Photo by Drew Beamer"
          fill
          class="h-full w-full rounded-md object-cover"
          ngSrcset="640w, 750w, 828w, 1080w, 1200w, 1920w, 2048w, 3840w"
          sizes="100vw"
          style="position: absolute; height: 100%; width: 100%; inset: 0px; color: transparent;"
        />
    </div>
  </div>
  `,
})
export class AspectRatioDemoDefault { }

export default AspectRatioDemoDefault