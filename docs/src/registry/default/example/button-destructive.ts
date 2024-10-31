import { UbButtonDirective } from '@/registry/default/ui/button'

import { Component } from '@angular/core'

@Component({
  standalone: true,
  selector: 'button-destructive-default',
  imports: [UbButtonDirective],
  template: `<button ubButton variant="destructive">Button</button>`,
})
export default class ButtonDestructiveDefault { }
