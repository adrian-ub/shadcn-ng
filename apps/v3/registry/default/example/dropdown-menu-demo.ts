import { Component } from '@angular/core'
import { UbButtonDirective } from '@/registry/default/ui/button'

import {
  DropdownSide,
  UbDropdownMenuContentDirective,
  UbDropdownMenuGroupDirective,
  UbDropdownMenuItemDirective,
  UbDropdownMenuLabelDirective,
  UbDropdownMenuSeparator,
  UbDropdownMenuShortcutDirective,
  UbDropdownMenuSubContentDirective,
  UbDropdownMenuSubTrigger,
  UbDropdownMenuTriggerDirective,
} from '@/registry/default/ui/dropdown-menu'

@Component({
  standalone: true,
  selector: '[dropdown-menu-demo-default]',
  imports: [
    UbDropdownMenuTriggerDirective,
    UbDropdownMenuContentDirective,
    UbDropdownMenuLabelDirective,
    UbDropdownMenuItemDirective,
    UbDropdownMenuSeparator,
    UbButtonDirective,
    UbDropdownMenuGroupDirective,
    UbDropdownMenuShortcutDirective,
    UbDropdownMenuSubTrigger,
    UbDropdownMenuSubContentDirective,
  ],
  template: `
  <button ubButton variant="outline" [ubDropdownMenuTrigger]="content">Open</button>

  <ng-template #content>
    <div ubDropdownMenuContent class="w-56">
      <div ubDropdownMenuLabel>My Account</div>
      <div ubDropdownMenuSeparator></div>
      <section ubDropdownMenuGroup>
        <div ubDropdownMenuItem>
          Profile
          <span ubDropdownMenuShortcut>⇧⌘P</span>
        </div>
        <div ubDropdownMenuItem>
          Billing
          <span ubDropdownMenuShortcut>⌘B</span>
        </div>
        <div ubDropdownMenuItem>
          Settings
          <span ubDropdownMenuShortcut>⌘S</span>
        </div>
        <div ubDropdownMenuItem>
          Keyboard shortcuts
          <span ubDropdownMenuShortcut>⌘K</span>
        </div>
      </section>
      <div ubDropdownMenuSeparator></div>
      <section ubDropdownMenuGroup>
        <div ubDropdownMenuItem>
          Team
        </div>
        <div>
          <div [ubDropdownMenuSubTrigger]="team" [side]="DropdownSide.Right">
            Invite users
          </div>
        </div>
        <div ubDropdownMenuItem>
          New Team
          <span ubDropdownMenuShortcut>⌘+T</span>
        </div>
      </section>
      <div ubDropdownMenuSeparator></div>
      <div ubDropdownMenuItem>GitHub</div>
      <div ubDropdownMenuItem>Support</div>
      <div ubDropdownMenuItem disabled>API</div>
      <div ubDropdownMenuSeparator></div>
      <div ubDropdownMenuItem>
        Log out
        <span ubDropdownMenuShortcut>⇧⌘Q</span>
      </div>
    </div>
  </ng-template>

  <ng-template #team>
    <div ubDropdownMenuSubContent class="w-56">
      <div ubDropdownMenuItem>
        Email
      </div>
      <div ubDropdownMenuItem>
        Message
      </div>
      <div ubDropdownMenuSeparator></div>
      <div ubDropdownMenuItem>
        More...
      </div>
    </div>
  </ng-template>
  `,
})
export default class DropDownMenuDemoDefault {
  protected readonly DropdownSide = DropdownSide
}
