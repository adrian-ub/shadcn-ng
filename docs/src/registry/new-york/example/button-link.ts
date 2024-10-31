import { UbButtonDirective } from '@/registry/new-york/ui/button'

import { Component } from '@angular/core'

@Component({
  standalone: true,
  selector: 'button-link-new-york',
  imports: [UbButtonDirective],
  template: `<button ubButton variant="link">Button</button>`,
})
export default class ButtonLinkNewYork { }
