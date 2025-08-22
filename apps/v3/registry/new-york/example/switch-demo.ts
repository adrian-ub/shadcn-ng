import { Component } from '@angular/core'

import { UbLabelDirective } from '@/registry/new-york/ui/label'
import { SwitchDirective } from '@/registry/new-york/ui/switch'

@Component({
  standalone: true,
  selector: '[switch-demo-new-york]',
  imports: [SwitchDirective, UbLabelDirective],
  template: `
    <div class="flex items-center space-x-2">
        <button ubSwitch id="airplane-mode"></button>
        <label for="airplane-mode" ubLabel>Airplane Mode</label>
    </div>
    `,
})
export default class SwitchDemoNewYork { }
