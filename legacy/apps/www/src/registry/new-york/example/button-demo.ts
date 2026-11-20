import { Component } from '@angular/core'

import { UbButtonDirective } from '~/registry/new-york/ui/button'

@Component({
  standalone: true,
  selector: '[button-demo-new-york]',
  imports: [UbButtonDirective],
  template: `<button ubButton>Button</button>`,
})
export default class ButtonDemoNewYork { }
