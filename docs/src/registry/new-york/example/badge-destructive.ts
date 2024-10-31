import { UbBadgeDirective } from '@/registry/new-york/ui/badge'

import { Component } from '@angular/core'

@Component({
  standalone: true,
  selector: 'badge-destructive-new-york',
  imports: [UbBadgeDirective],
  template: ` <div ubBadge variant="destructive">Badge</div> `,
})
export default class BadgeDestructiveNewYork { }
