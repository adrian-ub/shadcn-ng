import { Component } from '@angular/core'

import { UbBadgeDirective } from '@/registry/new-york/ui/badge'

@Component({
  standalone: true,
  selector: '[badge-outline-new-york]',
  imports: [UbBadgeDirective],
  template: ` <div ubBadge variant="outline">Badge</div> `,
})
export default class BadgeOutlineNewYork { }
