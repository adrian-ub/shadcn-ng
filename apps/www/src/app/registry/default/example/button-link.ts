import { UbButtonDirective } from '@/registry/default/ui/button'

import { Component } from '@angular/core'

@Component({
  standalone: true,
  selector: '[button-link-default]',
  imports: [UbButtonDirective],
  template: `<button ubButton variant="link">Button</button>`,
})
export default class ButtonLinkDefault { }
