import { Component } from "@angular/core";

import { UbButtonDirective } from "@/registry/default/ui/button.directive";

@Component({
    standalone: true,
    selector: "button-secondary-default",
    imports: [UbButtonDirective],
    template: `<button ubButton variant="secondary">Button</button>`,
})
export class ButtonSecondaryDefault { }

export default ButtonSecondaryDefault;
