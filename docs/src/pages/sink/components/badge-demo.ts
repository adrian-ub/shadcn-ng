import { Component } from '@angular/core'

import { lucideArrowRight, lucideCheck, lucideCircleAlert, NgxiLucide } from '@ngxi/lucide'

import { UbBadge } from '~/registry/new-york-v4/ui/badge'

@Component({
  selector: 'BadgeDemo',
  imports: [UbBadge, NgxiLucide],
  template: `
  <div class="flex flex-col items-center gap-2">
    <div class="flex w-full flex-col gap-2 md:flex-row">
      <span ubBadge>Badge</span>
      <span ubBadge variant="secondary">Secondary</span>
      <span ubBadge variant="destructive">Destructive</span>
      <span ubBadge variant="outline">Outline</span>
      <span ubBadge variant="outline">
        <svg [ngxiLucide]="lucideCheck"></svg>
        Badge
      </span>
      <span ubBadge variant="destructive">
        <svg [ngxiLucide]="lucideCircleAlert"></svg>
        Alert
      </span>
      <span ubBadge class="size-5 rounded-full p-0 font-mono tabular-nums">8</span>
    </div>
    <div class="flex w-full flex-col gap-2 md:flex-row">
      <a href="#" ubBadge>
        Link
        <svg [ngxiLucide]="lucideArrowRight"></svg>
      </a>
      <a href="#" ubBadge variant="secondary">
        Link
        <svg [ngxiLucide]="lucideArrowRight"></svg>
      </a>
      <a href="#" ubBadge variant="destructive">
        Link
        <svg [ngxiLucide]="lucideArrowRight"></svg>
      </a>
      <a href="#" ubBadge variant="outline">
        Link
        <svg [ngxiLucide]="lucideArrowRight"></svg>
      </a>
    </div>
  </div>
  `,
})
export default class BadgeDemo {
  protected readonly lucideCheck = lucideCheck
  protected readonly lucideCircleAlert = lucideCircleAlert
  protected readonly lucideArrowRight = lucideArrowRight
}
