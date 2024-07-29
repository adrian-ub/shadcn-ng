import { Component } from "@angular/core";

import { UbButtonDirective } from "@/registry/new-york/ui/button.directive";

@Component({
  standalone: true,
  imports: [UbButtonDirective],
  template: `<button ubButton>Button</button>`,
})
export class ButtonDemoComponent {}

export default ButtonDemoComponent;
