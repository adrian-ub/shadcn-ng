import { Component } from '@angular/core'

import { UbButtonDirective } from '@/registry/default/ui/button'

@Component({
  standalone: true,
  selector: '[button-secondary-default]',
  imports: [UbButtonDirective],
  template: `<button ubButton variant="secondary">Button</button>`,
})
export default class ButtonSecondaryDefault { }
