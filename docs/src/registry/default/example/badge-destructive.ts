import { UbBadgeDirective } from '@/registry/default/ui/badge'

import { Component } from '@angular/core'

@Component({
  standalone: true,
  selector: '[badge-destructive-default]',
  imports: [UbBadgeDirective],
  template: `<div ubBadge variant="destructive">Badge</div>`,
})
export default class BadgeDestructiveDefault { }
