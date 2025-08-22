import { Component } from '@angular/core'
import { UbButtonDirective } from '@/registry/new-york/ui/button'

import {
  UbDropdownMenuContentDirective,
  UbDropdownMenuLabelDirective,
  UbDropdownMenuRadioGroupDirective,
  UbDropdownMenuRadioItemDirective,
  UbDropdownMenuSeparator,
  UbDropdownMenuTriggerDirective,
} from '@/registry/new-york/ui/dropdown-menu'

@Component({
  standalone: true,
  selector: '[dropdown-menu-demo-new-york]',
  imports: [
    UbDropdownMenuTriggerDirective,
    UbDropdownMenuContentDirective,
    UbDropdownMenuLabelDirective,
    UbDropdownMenuSeparator,
    UbButtonDirective,
    UbDropdownMenuRadioItemDirective,
    UbDropdownMenuRadioGroupDirective,
  ],
  template: `
  <button ubButton variant="outline" [ubDropdownMenuTrigger]="content">Open</button>

  <ng-template #content>
    <div ubDropdownMenuContent class="w-56">
      <div ubDropdownMenuLabel>Panel Position</div>
      <div ubDropdownMenuSeparator></div>
      <div ubDropdownMenuRadioGroup [(value)]="position">
        <div ubDropdownMenuRadioItem value="top">
          Top
        </div>
        <div ubDropdownMenuRadioItem value="bottom">
          Bottom
        </div>
        <div ubDropdownMenuRadioItem value="right">
          Right
        </div>
      </div>
    </div>
  </ng-template>
  `,
})
export default class DropDownMenuRadioGroupNewYork {
  position = 'bottom'
}
