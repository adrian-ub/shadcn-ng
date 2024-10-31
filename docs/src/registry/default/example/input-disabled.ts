import { UbInputDirective } from '@/registry/default/ui/input'

import { Component } from '@angular/core'

@Component({
  standalone: true,
  selector: 'input-disabled-default',
  imports: [UbInputDirective],
  template: `<input disabled ubInput type="text" placeholder="Email" />`,
})
export default class InputDisabledDefault { }
