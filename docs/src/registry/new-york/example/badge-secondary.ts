import { UbBadgeDirective } from '@/registry/new-york/ui/badge'

import { Component } from '@angular/core'

@Component({
  standalone: true,
  selector: 'badge-secondary-new-york',
  imports: [UbBadgeDirective],
  template: ` <div ubBadge variant="secondary">Badge</div> `,
})
export default class BadgeSecondaryNewYork { }
