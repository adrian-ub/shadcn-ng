import { UbButtonDirective } from '@/registry/default/ui/button'

import { UbCardContentDirective, UbCardDescriptionDirective, UbCardDirective, UbCardFooterDirective, UbCardHeaderDirective, UbCardTitleDirective } from '@/registry/default/ui/card'
import { UbInputDirective } from '@/registry/default/ui/input'
import { UbLabelDirective } from '@/registry/default/ui/label'
import { UbTabsContentDirective, UbTabsDirective, UbTabsListDirective, UbTabsTriggerDirective } from '@/registry/default/ui/tabs'
import { Component } from '@angular/core'

@Component({
  standalone: true,
  selector: '[tabs-demo-default]',
  imports: [
    UbTabsDirective,
    UbTabsListDirective,
    UbTabsTriggerDirective,
    UbTabsContentDirective,

    UbCardDirective,
    UbCardHeaderDirective,
    UbCardTitleDirective,
    UbCardDescriptionDirective,
    UbCardContentDirective,
    UbCardFooterDirective,

    UbButtonDirective,

    UbLabelDirective,
    UbInputDirective,
  ],
  template: `
    <div ubTabs defaultValue="account" class="w-[400px]">
        <div ubTabsList class="grid w-full grid-cols-2">
            <button ubTabsTrigger value="account">Account</button>
            <button ubTabsTrigger value="password">Password</button>
        </div>

        <section ubTabsContent value="account">
            <div ubCard>
                <div ubCardHeader>
                    <h3 ubCardTitle>Account</h3>
                    <p ubCardDescription>Make changes to your account here. Click save when you're done.</p>
                </div>

                <div ubCardContent class="space-y-2">
                    <div class="space-y-1">
                        <label ubLabel htmlFor="name">Name</label>
                        <input ubInput type="text" id="name" value="Pedro Duarte" />
                    </div>
                    <div class="space-y-1">
                        <label ubLabel htmlFor="username">Username</label>
                        <input ubInput type="text" id="username" value="@peduarte" />
                    </div>
                </div>

                <div ubCardFooter>
                    <button ubButton>Save changes</button>
                </div>
            </div>
        </section>

        <section ubTabsContent value="password">
            <div ubCard>
                <div ubCardHeader>
                    <h5 ubCardTitle>Password</h5>
                    <div ubCardDescription>Change your password here. After saving, you'll be logged out.</div>
                </div>

                <div ubCardContent class="space-y-2">
                    <div class="space-y-1">
                        <label ubLabel htmlFor="current">Current password</label>
                        <input ubInput type="password" id="current" />
                    </div>
                    <div class="space-y-1">
                        <label ubLabel htmlFor="new">New password</label>
                        <input ubInput type="password" id="new" />
                    </div>
                </div>

                <div ubCardFooter>
                    <button ubButton>Save changes</button>
                </div>
            </div>
        </section>
    </div>
    `,
})
export default class TabsDemoDefault { }
