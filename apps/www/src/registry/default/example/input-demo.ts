import { Component } from "@angular/core";

import { UbInputDirective } from "@/registry/default/ui/input.directive";

@Component({
  standalone: true,
  imports: [UbInputDirective],
  template: ` <input ubInput type="text" placeholder="Email" /> `,
})
export class InputDemoComponent {}

export default InputDemoComponent;
