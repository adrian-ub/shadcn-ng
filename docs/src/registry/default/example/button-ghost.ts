import { UbButtonDirective } from '@/registry/default/ui/button'

import { Component } from '@angular/core'

@Component({
  standalone: true,
  selector: 'button-ghost-default',
  imports: [UbButtonDirective],
  template: `<button ubButton variant="ghost">Button</button>`,
})
export class ButtonGhostDefault { }

export default ButtonGhostDefault
