import type { ImageLoaderConfig } from '@angular/common'

import { IMAGE_LOADER, NgOptimizedImage } from '@angular/common'
import { Component } from '@angular/core'
import { UbAspectRatioDirective } from '~/registry/new-york-v4/ui/aspect-ratio'

@Component({
  standalone: true,
  selector: '[aspect-ratio-demo-new-york]',
  imports: [UbAspectRatioDirective, NgOptimizedImage],
  providers: [
    {
      provide: IMAGE_LOADER,
      useValue: (config: ImageLoaderConfig) => {
        return `${config?.src}?w=${config?.width}`
      },
    },
  ],
  template: `
  <div class="grid w-full max-w-sm items-start gap-4">
    <div class="w-sm">
      <div ubAspectRatio [ratio]="16 / 9" class="bg-muted">
          <img
            ngSrc="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd"
            alt="Photo by Drew Beamer"
            fill
            class="h-full w-full rounded-md object-cover dark:brightness-[0.2] dark:grayscale"
            ngSrcset="640w, 750w, 828w, 1080w, 1200w, 1920w, 2048w, 3840w"
            sizes="100vw"
            style="position: absolute; height: 100%; width: 100%; inset: 0px; color: transparent;"
            priority
          />
      </div>
    </div>
    <div class="w-full max-w-sm">
      <div ubAspectRatio [ratio]="1 / 1" class="bg-muted">
        <img
          ngSrc="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd"
          alt="Photo by Drew Beamer"
          fill
          class="h-full w-full rounded-md object-cover dark:brightness-[0.2] dark:grayscale"
          ngSrcset="640w, 750w, 828w, 1080w, 1200w, 1920w, 2048w, 3840w"
          sizes="100vw"
          style="position: absolute; height: 100%; width: 100%; inset: 0px; color: transparent;"
          priority
        />
      </div>
    </div>
  </div>
  `,
})
export default class AspectRatioDemoNewYork { }
