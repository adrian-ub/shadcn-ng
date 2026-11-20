import { Component } from '@angular/core'

import { UbButtonDirective } from '~/registry/default/ui/button'

@Component({
  standalone: true,
  selector: '[button-destructive-default]',
  imports: [UbButtonDirective],
  template: `<button ubButton variant="destructive">Button</button>`,
})
export default class ButtonDestructiveDefault { }
