import { UbButtonDirective } from '@/registry/new-york/ui/button.directive'

import { Component } from '@angular/core'

@Component({
  standalone: true,
  selector: 'button-demo-new-york',
  imports: [UbButtonDirective],
  template: `<button ubButton>Button</button>`,
})
export class ButtonDemoNewYork { }

export default ButtonDemoNewYork
