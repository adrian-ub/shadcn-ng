import { Component } from '@angular/core'

import { UbSkeletonDirective } from '~/registry/default/ui/skeleton'

@Component({
  standalone: true,
  selector: '[skeleton-card-default]',
  imports: [UbSkeletonDirective],
  template: `
    <div class="flex flex-col space-y-3">
        <div ubSkeleton class="h-[125px] w-[250px] rounded-xl"></div>
        <div class="space-y-2">
            <div ubSkeleton class="h-4 w-[250px]"></div>
            <div ubSkeleton class="h-4 w-[200px]"></div>
        </div>
    </div>
    `,
})
export default class SekeletonCardDefault { }
