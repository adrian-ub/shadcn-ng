import { Component } from '@angular/core'

import { UbButtonDirective } from '~/registry/new-york/ui/button'

@Component({
  standalone: true,
  selector: '[button-outline-new-york]',
  imports: [UbButtonDirective],
  template: `<button ubButton variant="outline">Button</button>`,
})
export default class ButtonOutlineNewYork { }
