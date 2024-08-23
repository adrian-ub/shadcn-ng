import { Component } from "@angular/core";

import { UbButtonDirective } from "@/registry/default/ui/button.directive";

@Component({
    standalone: true,
    selector: "button-ghost-default",
    imports: [UbButtonDirective],
    template: `<button ubButton variant="ghost">Button</button>`,
})
export class ButtonGhostDefault { }

export default ButtonGhostDefault;
