import { Component } from '@angular/core'

import { UbInputDirective } from '@/registry/default/ui/input'

@Component({
  standalone: true,
  selector: '[input-demo-default]',
  imports: [UbInputDirective],
  template: `<input ubInput type="text" placeholder="Email" />`,
})
export default class InputDemoDefault { }
