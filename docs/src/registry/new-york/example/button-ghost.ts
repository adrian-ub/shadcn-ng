import { UbButtonDirective } from '@/registry/new-york/ui/button'

import { Component } from '@angular/core'

@Component({
  standalone: true,
  selector: 'button-ghost-new-york',
  imports: [UbButtonDirective],
  template: `<button ubButton variant="ghost">Button</button>`,
})
export class ButtonGhostNewYork { }

export default ButtonGhostNewYork
