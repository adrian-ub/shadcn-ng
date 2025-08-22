import { Component } from '@angular/core'

import { UbInputDirective } from '@/registry/new-york/ui/input'

@Component({
  standalone: true,
  selector: '[input-disabled-new-york]',
  imports: [UbInputDirective],
  template: ` <input disabled ubInput type="text" placeholder="Email" /> `,
})
export default class InputDisabledNewYork { }
