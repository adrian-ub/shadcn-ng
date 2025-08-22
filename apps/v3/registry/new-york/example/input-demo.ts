import { Component } from '@angular/core'

import { UbInputDirective } from '@/registry/new-york/ui/input'

@Component({
  standalone: true,
  selector: '[input-demo-new-york]',
  imports: [UbInputDirective],
  template: ` <input ubInput type="text" placeholder="Email" /> `,
})
export default class InputDemoNewYork { }
