import { Component } from "@angular/core";

import { UbBadgeDirective } from "@/registry/new-york/ui/badge.directive";

@Component({
    standalone: true,
    selector: "badge-demo-new-york",
    imports: [UbBadgeDirective],
    template: ` <div ubBadge>Badge</div> `,
})
export class BadgeDemoNewYork { }

export default BadgeDemoNewYork;
