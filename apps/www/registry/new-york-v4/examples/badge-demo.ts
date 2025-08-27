import { Component } from '@angular/core'

import { lucideBadgeCheck, NgxiLucide } from '@ngxi/lucide'

import { UbBadge } from '@/registry/new-york-v4/ui/badge'

@Component({
  standalone: true,
  imports: [UbBadge, NgxiLucide],
  template: `
  <div class="flex flex-col items-center gap-2">
    <div class="flex w-full flex-wrap gap-2">
      <span ubBadge>Badge</span>
      <span ubBadge variant="secondary">Secondary</span>
      <span ubBadge variant="destructive">Destructive</span>
      <span ubBadge variant="outline">Outline</span>
    </div>
    <div class="flex w-full flex-wrap gap-2">
      <span ubBadge variant="secondary" class="bg-blue-500 text-white dark:bg-blue-600">
        <svg [ngxiLucide]="lucideBadgeCheck"></svg>
        Verified
      </span>
      <span ubBadge class="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">8</span>
      <span ubBadge variant="destructive" class="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">99</span>
      <span ubBadge variant="outline" class="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">20+</span>
    </div>
  </div>
  `,
})
export class BadgeDemo {
  protected readonly lucideBadgeCheck = lucideBadgeCheck
}
