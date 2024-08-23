import { Component } from "@angular/core";

import { UbInputDirective } from "@/registry/new-york/ui/input.directive";

@Component({
    standalone: true,
    selector: "input-demo-new-york",
    imports: [UbInputDirective],
    template: ` <input ubInput type="text" placeholder="Email" /> `,
})
export class InputDemoNewYork { }

export default InputDemoNewYork;
