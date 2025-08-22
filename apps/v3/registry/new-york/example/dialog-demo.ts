import { Component } from '@angular/core'
import { UbButtonDirective } from '@/registry/new-york/ui/button'
import {
  UbDialogContentDirective,
  UbDialogDescriptionDirective,
  UbDialogFooterDirective,
  UbDialogHeaderDirective,
  UbDialogTitleDirective,
  UbDialogTriggerDirective,
} from '@/registry/new-york/ui/dialog'
import { UbInputDirective } from '@/registry/new-york/ui/input'

import { UbLabelDirective } from '@/registry/new-york/ui/label'

@Component({
  standalone: true,
  selector: '[dialog-demo-new-york]',
  imports: [
    UbDialogTriggerDirective,
    UbDialogContentDirective,
    UbDialogHeaderDirective,
    UbDialogTitleDirective,
    UbDialogDescriptionDirective,
    UbDialogFooterDirective,

    UbButtonDirective,
    UbLabelDirective,
    UbInputDirective,
  ],
  template: `
    <button ubButton variant="outline" [ubDialogTrigger]="dialog">Edit Profile</button>
    <ng-template #dialog>
      <div ubDialogContent class="sm:max-w-[425px]">
        <div ubDialogHeader>
          <h2 ubDialogTitle>Edit profile</h2>
          <p ubDialogDescription>Make changes to your profile here. Click save when you're done.</p>
        </div>

        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <label ubLabel htmlFor="name" class="text-right">
              Name
            </label>
            <input ubInput type="text" id="name" value="Pedro Duarte" class="col-span-3" />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <label ubLabel htmlFor="username" class="text-right">
              Username
            </label>
            <input ubInput type="text" id="username" value="@peduarte" class="col-span-3" />
          </div>
        </div>

        <div ubDialogFooter>
          <button ubButton>Save changes</button>
        </div>

      </div>
    </ng-template>
  `,
})
export default class DialogDemoNewYork { }
