import { UbButtonDirective } from '@/registry/new-york/ui/button.directive'

import { Component } from '@angular/core'

@Component({
  standalone: true,
  selector: 'button-destructive-new-york',
  imports: [UbButtonDirective],
  template: `<button ubButton variant="destructive">Button</button>`,
})
export class ButtonDestructiveNewYork { }

export default ButtonDestructiveNewYork
