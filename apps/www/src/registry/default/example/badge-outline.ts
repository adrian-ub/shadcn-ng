import { Component } from "@angular/core";

import { UbBadgeDirective } from "@/registry/default/ui/badge.directive";

@Component({
    standalone: true,
    selector: "badge-demo-default",
    imports: [UbBadgeDirective],
    template: `<div ubBadge variant="outline">Badge</div>`,
})
export class BadgeOutlineDefault { }

export default BadgeOutlineDefault;
