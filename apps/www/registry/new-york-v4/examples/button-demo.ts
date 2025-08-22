import { Component } from '@angular/core'

import { UbButton } from '@/registry/new-york-v4/ui/button'

@Component({
  imports: [UbButton],
  template: `
    <div class="flex flex-wrap items-center gap-2 md:flex-row">
      <button ubButton>Button</button>
    </div>
  `,
})
export default class ButtonDemo {}
