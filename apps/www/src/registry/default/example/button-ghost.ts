import { Component } from '@angular/core'

import { UbButtonDirective } from '~/registry/default/ui/button'

@Component({
  standalone: true,
  selector: '[button-ghost-default]',
  imports: [UbButtonDirective],
  template: `<button ubButton variant="ghost">Button</button>`,
})
export default class ButtonGhostDefault { }
