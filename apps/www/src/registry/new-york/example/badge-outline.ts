import { Component } from "@angular/core";

import { UbBadgeDirective } from "@/registry/new-york/ui/badge.directive";

@Component({
    standalone: true,
    selector: "badge-outline-new-york",
    imports: [UbBadgeDirective],
    template: ` <div ubBadge variant="outline">Badge</div> `,
})
export class BadgeOutlineNewYork { }

export default BadgeOutlineNewYork;
