import { Component } from '@angular/core'

import { UbButtonDirective } from '@/registry/new-york/ui/button'

@Component({
  standalone: true,
  selector: '[button-link-new-york]',
  imports: [UbButtonDirective],
  template: `<button ubButton variant="link">Button</button>`,
})
export default class ButtonLinkNewYork { }
