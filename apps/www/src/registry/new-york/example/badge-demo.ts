import { Component } from "@angular/core";

import { UbBadgeDirective } from "@/registry/new-york/ui/badge.directive";

@Component({
  standalone: true,
  imports: [UbBadgeDirective],
  template: ` <div ubBadge>Badge</div> `,
})
export class BadgeDemoComponent {}

export default BadgeDemoComponent;
