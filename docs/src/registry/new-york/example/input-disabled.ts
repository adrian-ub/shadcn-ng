import { UbInputDirective } from '@/registry/new-york/ui/input'

import { Component } from '@angular/core'

@Component({
  standalone: true,
  selector: 'input-disabled-new-york',
  imports: [UbInputDirective],
  template: ` <input disabled ubInput type="text" placeholder="Email" /> `,
})
export default class InputDisabledNewYork { }
