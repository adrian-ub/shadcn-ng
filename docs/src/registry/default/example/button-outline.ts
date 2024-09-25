import { UbButtonDirective } from '@/registry/default/ui/button.directive'

import { Component } from '@angular/core'

@Component({
  standalone: true,
  selector: 'button-outline-default',
  imports: [UbButtonDirective],
  template: `<button ubButton variant="outline">Button</button>`,
})
export class ButtonOutlineDefault { }

export default ButtonOutlineDefault