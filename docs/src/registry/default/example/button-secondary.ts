import { UbButtonDirective } from '@/registry/default/ui/button.directive'

import { Component } from '@angular/core'

@Component({
  standalone: true,
  selector: 'button-secondary-default',
  imports: [UbButtonDirective],
  template: `<button ubButton variant="secondary">Button</button>`,
})
export class ButtonSecondaryDefault { }

export default ButtonSecondaryDefault