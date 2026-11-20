import { Component } from '@angular/core'

import { UbBadgeDirective } from '~/registry/default/ui/badge'

@Component({
  standalone: true,
  selector: '[badge-destructive-default]',
  imports: [UbBadgeDirective],
  template: `<div ubBadge variant="destructive">Badge</div>`,
})
export default class BadgeDestructiveDefault { }
