import { Component } from '@angular/core'

import { UbButtonDirective } from '@/registry/default/ui/button'

@Component({
  standalone: true,
  selector: '[button-demo-default]',
  imports: [UbButtonDirective],
  template: `<button ubButton>Button</button>`,
})
export default class ButtonDemoDefault { }
