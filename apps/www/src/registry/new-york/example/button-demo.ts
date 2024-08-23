import { Component } from "@angular/core";

import { UbButtonDirective } from "@/registry/new-york/ui/button.directive";

@Component({
    standalone: true,
    selector: "button-demo-new-york",
    imports: [UbButtonDirective],
    template: `<button ubButton>Button</button>`,
})
export class ButtonDemoNewYork { }

export default ButtonDemoNewYork;
