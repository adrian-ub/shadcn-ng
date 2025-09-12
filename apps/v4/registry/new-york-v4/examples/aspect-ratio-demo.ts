import { Component } from '@angular/core'

import { UbAspectRatio } from '@/registry/new-york-v4/ui/aspect-ratio'

@Component({
  standalone: true,
  imports: [UbAspectRatio],
  template: `
  <div ubAspectRatio [ratio]="16 / 9" class="bg-muted rounded-lg">
    <img src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80" alt="Photo by Drew Beamer" class="h-full w-full rounded-lg dark:brightness-[0.2] dark:grayscale object-cover">
  </div>
  `,
})
export class AspectRatioDemo { }
