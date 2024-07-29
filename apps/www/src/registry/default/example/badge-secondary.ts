import { Component } from "@angular/core";

import { UbBadgeDirective } from "@/registry/default/ui/badge.directive";

@Component({
  standalone: true,
  imports: [UbBadgeDirective],
  template: ` <div ubBadge variant="secondary">Badge</div> `,
})
export class BadgeSecondaryComponent {}

export default BadgeSecondaryComponent;
