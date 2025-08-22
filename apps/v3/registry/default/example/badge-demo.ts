import { Component } from '@angular/core'

import { UbBadgeDirective } from '@/registry/default/ui/badge'

@Component({
  standalone: true,
  selector: '[badge-demo-default]',
  imports: [UbBadgeDirective],
  template: `<div ubBadge>Badge</div>`,
})
export default class BadgeDemoDefault { }
