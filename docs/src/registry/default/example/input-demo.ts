import { UbInputDirective } from '@/registry/default/ui/input.directive'

import { Component } from '@angular/core'

@Component({
  standalone: true,
  selector: 'input-demo-default',
  imports: [UbInputDirective],
  template: `<input ubInput type="text" placeholder="Email" />`,
})
export class InputDemoDefault { }

export default InputDemoDefault
