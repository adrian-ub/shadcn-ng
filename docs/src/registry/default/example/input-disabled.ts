import { UbInputDirective } from '@/registry/default/ui/input.directive'

import { Component } from '@angular/core'

@Component({
  standalone: true,
  selector: 'input-disabled-default',
  imports: [UbInputDirective],
  template: `<input disabled ubInput type="text" placeholder="Email" />`,
})
export class InputDisabledDefault { }

export default InputDisabledDefault
