import { UbButtonDirective } from '@/registry/default/ui/button'

import { Component } from '@angular/core'

@Component({
  standalone: true,
  selector: '[button-demo-default]',
  imports: [UbButtonDirective],
  template: `<button ubButton>Button</button>`,
})
export default class ButtonDemoDefault { }
