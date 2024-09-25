import { UbBadgeDirective } from '@/registry/new-york/ui/badge.directive'

import { Component } from '@angular/core'

@Component({
  standalone: true,
  selector: 'badge-destructive-new-york',
  imports: [UbBadgeDirective],
  template: ` <div ubBadge variant="destructive">Badge</div> `,
})
export class BadgeDestructiveNewYork { }

export default BadgeDestructiveNewYork