import { Component } from '@angular/core'

import { UbBadgeDirective } from '@/registry/default/ui/badge'

@Component({
  standalone: true,
  selector: '[badge-secondary-default]',
  imports: [UbBadgeDirective],
  template: `<div ubBadge variant="secondary">Badge</div>`,
})
export default class BadgeSecondaryDefault { }
