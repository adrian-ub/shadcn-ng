import { Component } from '@angular/core'

import { UbSeparatorDirective } from '@/registry/new-york/ui/separator'

@Component({
  standalone: true,
  selector: '[separator-demo-new-york]',
  imports: [UbSeparatorDirective],
  template: `
    <div>
      <div class="space-y-1">
        <h4 class="text-sm font-medium leading-none">Radix Primitives</h4>
        <p class="text-sm text-muted-foreground">
          An open-source UI component library.
        </p>
      </div>
      <div ubSeperator class="my-4"></div>
      <div class="flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <div ubSeperator orientation="vertical"></div>
        <div>Docs</div>
        <div ubSeperator orientation="vertical"></div>
        <div>Source</div>
      </div>
    </div>
  `,
})
export default class SeparatorNewYork { }
