import { Component } from '@angular/core'

import { UbButtonDirective } from '~/registry/default/ui/button'

@Component({
  standalone: true,
  selector: '[button-outline-default]',
  imports: [UbButtonDirective],
  template: `<button ubButton variant="outline">Button</button>`,
})
export default class ButtonOutlineDefault { }
