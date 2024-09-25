import { UbLabelDirective } from '@/registry/new-york/ui/label'

import { SwitchDirective } from '@/registry/new-york/ui/switch'
import { Component } from '@angular/core'

@Component({
  standalone: true,
  selector: 'switch-demo-new-york',
  imports: [SwitchDirective, UbLabelDirective],
  template: `
    <div class="flex items-center space-x-2">
        <button ubSwitch id="airplane-mode"></button>
        <label for="airplane-mode">Airplane Mode</label>
    </div>
    `,
})
export class SwitchDemoNewYork { }

export default SwitchDemoNewYork
