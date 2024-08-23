import { Component } from "@angular/core";

import { UbBadgeDirective } from "@/registry/new-york/ui/badge.directive";

@Component({
    standalone: true,
    selector: "badge-destructive-new-york",
    imports: [UbBadgeDirective],
    template: ` <div ubBadge variant="destructive">Badge</div> `,
})
export class BadgeDestructiveNewYork { }

export default BadgeDestructiveNewYork;
