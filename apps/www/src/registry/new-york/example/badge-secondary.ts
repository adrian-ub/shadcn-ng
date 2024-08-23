import { Component } from "@angular/core";

import { UbBadgeDirective } from "@/registry/new-york/ui/badge.directive";

@Component({
    standalone: true,
    selector: "badge-secondary-new-york",
    imports: [UbBadgeDirective],
    template: ` <div ubBadge variant="secondary">Badge</div> `,
})
export class BadgeSecondaryNewYork { }

export default BadgeSecondaryNewYork;
