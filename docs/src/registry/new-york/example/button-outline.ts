import { UbButtonDirective } from '@/registry/new-york/ui/button'

import { Component } from '@angular/core'

@Component({
  standalone: true,
  selector: 'button-outline-new-york',
  imports: [UbButtonDirective],
  template: `<button ubButton variant="outline">Button</button>`,
})
export class ButtonOutlineNewYork { }

export default ButtonOutlineNewYork
