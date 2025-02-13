import { Component } from '@angular/core'

import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideArrowRight, lucideCheck, lucideCircleAlert } from '@ng-icons/lucide'

import { UbBadgeDirective } from '~/registry/new-york-v4/ui/badge'

@Component({
  selector: 'BadgeDemo',
  imports: [UbBadgeDirective, NgIcon],
  viewProviders: [provideIcons({ lucideCheck, lucideCircleAlert, lucideArrowRight })],
  template: `
  <div class="flex flex-col items-center gap-2">
    <div class="flex w-full flex-col gap-2 md:flex-row">
      <span ubBadge>Badge</span>
      <span ubBadge variant="secondary">Secondary</span>
      <span ubBadge variant="destructive">Destructive</span>
      <span ubBadge variant="outline">Outline</span>
      <span ubBadge variant="outline">
        <ng-icon name="lucideCheck"></ng-icon>
        Badge
      </span>
      <span ubBadge variant="destructive">
        <ng-icon name="lucideCircleAlert"></ng-icon>
        Alert
      </span>
      <span ubBadge class="size-5 rounded-full p-0 font-mono tabular-nums">8</span>
    </div>
    <div class="flex w-full flex-col gap-2 md:flex-row">
      <a href="#" ubBadge>
        Link
        <ng-icon name="lucideArrowRight"></ng-icon>
      </a>
      <a href="#" ubBadge variant="secondary">
        Link
        <ng-icon name="lucideArrowRight"></ng-icon>
      </a>
      <a href="#" ubBadge variant="destructive">
        Link
        <ng-icon name="lucideArrowRight"></ng-icon>
      </a>
      <a href="#" ubBadge variant="outline">
        Link
        <ng-icon name="lucideArrowRight"></ng-icon>
      </a>
    </div>
  </div>
  `,
})
export default class BadgeDemo { }
