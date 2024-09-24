import { UbButtonDirective } from '@/registry/new-york/ui/button.directive'

import { Component } from '@angular/core'

@Component({
  standalone: true,
  selector: 'button-secondary-new-york',
  imports: [UbButtonDirective],
  template: `<button ubButton variant="secondary">Button</button>`,
})
export class ButtonSecondaryNewYork { }

export default ButtonSecondaryNewYork
