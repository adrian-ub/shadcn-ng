import { Component } from '@angular/core'

import { UbButtonDirective } from '@/registry/new-york/ui/button'

@Component({
  standalone: true,
  selector: '[button-destructive-new-york]',
  imports: [UbButtonDirective],
  template: `<button ubButton variant="destructive">Button</button>`,
})
export default class ButtonDestructiveNewYork { }
