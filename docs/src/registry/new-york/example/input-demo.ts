import { UbInputDirective } from '@/registry/new-york/ui/input'

import { Component } from '@angular/core'

@Component({
  standalone: true,
  selector: '[input-demo-new-york]',
  imports: [UbInputDirective],
  template: ` <input ubInput type="text" placeholder="Email" /> `,
})
export default class InputDemoNewYork { }
