import { Component } from "@angular/core";

import { UbInputDirective } from "@/registry/default/ui/input.directive";

@Component({
    standalone: true,
    selector: "input-disabled-default",
    imports: [UbInputDirective],
    template: `<input disabled ubInput type="text" placeholder="Email" />`,
})
export class InputDisabledDefault { }

export default InputDisabledDefault;
