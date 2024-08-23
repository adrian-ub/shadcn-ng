import { Component } from "@angular/core";

import { UbButtonDirective } from "@/registry/default/ui/button.directive";

@Component({
    standalone: true,
    selector: "button-outline-default",
    imports: [UbButtonDirective],
    template: `<button ubButton variant="outline">Button</button>`,
})
export class ButtonOutlineDefault { }

export default ButtonOutlineDefault;
