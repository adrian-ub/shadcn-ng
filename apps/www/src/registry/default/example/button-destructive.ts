import { Component } from "@angular/core";

import { UbButtonDirective } from "@/registry/default/ui/button.directive";

@Component({
  standalone: true,
  imports: [UbButtonDirective],
  template: `<button ubButton variant="destructive">Button</button>`,
})
export class ButtonDemoComponent {}

export default ButtonDemoComponent;
