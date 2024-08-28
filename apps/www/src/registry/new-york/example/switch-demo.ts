import { Component } from '@angular/core';

import { SwitchDirective } from '@/registry/new-york/ui/switch.directive'
import { UbLabelDirective } from '@/registry/new-york/ui/label.directive'

@Component({
    standalone: true,
    selector: 'switch-demo-new-york',
    imports: [SwitchDirective, UbLabelDirective],
    template: `
    <div class="flex items-center space-x-2">
        <button ubSwitch id="airplane-mode"></button>
        <label for="airplane-mode">Airplane Mode</label>
    </div>
    `
})
export class SwitchDemoNewYork { }

export default SwitchDemoNewYork;
