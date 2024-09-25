import { UbButtonDirective } from '@/registry/default/ui/button.directive'

import { Component } from '@angular/core'

@Component({
  standalone: true,
  selector: 'button-destructive-default',
  imports: [UbButtonDirective],
  template: `<button ubButton variant="destructive">Button</button>`,
})
export class ButtonDestructiveDefault { }

export default ButtonDestructiveDefault