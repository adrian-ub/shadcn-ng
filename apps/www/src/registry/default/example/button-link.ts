import { Component } from "@angular/core";

import { UbButtonDirective } from "@/registry/default/ui/button.directive";

@Component({
    standalone: true,
    selector: "button-link-default",
    imports: [UbButtonDirective],
    template: `<button ubButton variant="link">Button</button>`,
})
export class ButtonLinkDefault { }

export default ButtonLinkDefault;
