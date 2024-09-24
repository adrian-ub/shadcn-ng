import { UbBadgeDirective } from '@/registry/default/ui/badge.directive'

import { Component } from '@angular/core'

@Component({
  standalone: true,
  selector: 'badge-demo-default',
  imports: [UbBadgeDirective],
  template: `<div ubBadge>Badge</div>`,
})
export class BadgeDemoDefault { }

export default BadgeDemoDefault
