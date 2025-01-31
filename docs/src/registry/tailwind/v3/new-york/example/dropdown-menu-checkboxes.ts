import { Component } from '@angular/core'
import { UbButtonDirective } from '~/registry/new-york/ui/button'

import {
  UbDropdownMenuCheckboxItemDirective,
  UbDropdownMenuContentDirective,
  UbDropdownMenuLabelDirective,
  UbDropdownMenuSeparator,
  UbDropdownMenuTriggerDirective,
} from '~/registry/new-york/ui/dropdown-menu'

@Component({
  standalone: true,
  selector: '[dropdown-menu-demo-new-york]',
  imports: [
    UbDropdownMenuTriggerDirective,
    UbDropdownMenuContentDirective,
    UbDropdownMenuLabelDirective,
    UbDropdownMenuSeparator,
    UbButtonDirective,
    UbDropdownMenuCheckboxItemDirective,
  ],
  template: `
  <button ubButton variant="outline" [ubDropdownMenuTrigger]="content">Open</button>

  <ng-template #content>
    <div ubDropdownMenuContent class="w-56">
      <div ubDropdownMenuLabel>Appearance</div>
      <div ubDropdownMenuSeparator></div>
      <div ubDropdownMenuCheckboxItem [(checked)]="statusBar">
        Status Bar
      </div>
      <div ubDropdownMenuCheckboxItem [(checked)]="activityBar" disabled>
        Activity Bar
      </div>
      <div ubDropdownMenuCheckboxItem [(checked)]="panel">
        Panel
      </div>
    </div>
  </ng-template>
  `,
})
export default class DropDownMenuCheckboxesNewYork {
  statusBar = true
  activityBar = false
  panel = false
}
