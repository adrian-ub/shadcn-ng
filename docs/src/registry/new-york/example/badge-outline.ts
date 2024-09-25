import { UbBadgeDirective } from '@/registry/new-york/ui/badge'

import { Component } from '@angular/core'

@Component({
  standalone: true,
  selector: 'badge-outline-new-york',
  imports: [UbBadgeDirective],
  template: ` <div ubBadge variant="outline">Badge</div> `,
})
export class BadgeOutlineNewYork { }

export default BadgeOutlineNewYork
