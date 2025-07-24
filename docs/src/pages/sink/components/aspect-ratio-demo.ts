import { Component } from '@angular/core'

import { UbAspectRatio } from '~/registry/new-york-v4/ui/aspect-ratio'

@Component({
  selector: 'AspectRatioDemo',
  standalone: true,
  imports: [UbAspectRatio],
  template: `
  <div class="grid w-full max-w-sm items-start gap-4">
    <div class="w-sm">
      <div ubAspectRatio [ratio]="16 / 9" class="bg-muted rounded-lg">
        <img src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80" alt="Photo by Drew Beamer" class="h-full w-full rounded-lg object-cover dark:brightness-[0.2] dark:grayscale">
      </div>
    </div>
    <div ubAspectRatio [ratio]="1 / 1" class="bg-muted rounded-lg">
      <img src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80" alt="Photo by Drew Beamer" class="h-full w-full rounded-lg object-cover dark:brightness-[0.2] dark:grayscale">
    </div>
  </div>
  `,
})
export class AspectRatioDemo { }
