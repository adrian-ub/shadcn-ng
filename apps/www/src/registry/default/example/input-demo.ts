import { Component } from "@angular/core";

import { UbInputDirective } from "@/registry/default/ui/input.directive";

@Component({
    standalone: true,
    selector: "input-demo-default",
    imports: [UbInputDirective],
    template: `<input ubInput type="text" placeholder="Email" />`,
})
export class InputDemoDefault { }

export default InputDemoDefault;
