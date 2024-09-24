import { UbButtonDirective } from '@/registry/default/ui/button.directive'

import { Component } from '@angular/core'

@Component({
  standalone: true,
  selector: 'button-demo-default',
  imports: [UbButtonDirective],
  template: `<button ubButton>Button</button>`,
})
export class ButtonDemoDefault { }

export default ButtonDemoDefault
