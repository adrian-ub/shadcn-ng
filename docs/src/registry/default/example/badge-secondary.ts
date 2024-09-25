import { UbBadgeDirective } from '@/registry/default/ui/badge.directive'

import { Component } from '@angular/core'

@Component({
  standalone: true,
  selector: 'badge-secondary-default',
  imports: [UbBadgeDirective],
  template: `<div ubBadge variant="secondary">Badge</div>`,
})
export class BadgeSecondaryDefault { }

export default BadgeSecondaryDefault