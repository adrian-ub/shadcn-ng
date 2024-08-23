import { Component } from "@angular/core";

import { UbButtonDirective } from "@/registry/default/ui/button.directive";

@Component({
    standalone: true,
    selector: "button-demo-default",
    imports: [UbButtonDirective],
    template: `<button ubButton>Button</button>`,
})
export class ButtonDemoDefault { }

export default ButtonDemoDefault;
