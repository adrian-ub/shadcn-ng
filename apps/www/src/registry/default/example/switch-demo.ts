import { Component } from '@angular/core';

import { SwitchDirective } from '@/registry/default/ui/switch.directive'
import { UbLabelDirective } from '@/registry/default/ui/label.directive'

@Component({
    standalone: true,
    selector: 'switch-demo-default',
    imports: [SwitchDirective, UbLabelDirective],
    template: `
    <div class="flex items-center space-x-2">
        <button ubSwitch id="airplane-mode"></button>
        <label for="airplane-mode">Airplane Mode</label>
    </div>
    `
})
export class SwitchDemoDefault { }

export default SwitchDemoDefault;
