import { UbBadgeDirective } from '@/registry/default/ui/badge'

import { Component } from '@angular/core'

@Component({
  standalone: true,
  selector: 'badge-demo-default',
  imports: [UbBadgeDirective],
  template: `<div ubBadge variant="outline">Badge</div>`,
})
export class BadgeOutlineDefault { }

export default BadgeOutlineDefault
