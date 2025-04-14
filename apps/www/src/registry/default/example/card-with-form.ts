import { Component } from '@angular/core'
import { UbButtonDirective } from '~/registry/new-york/ui/button'
import {
  UbCardContentDirective,
  UbCardDescriptionDirective,
  UbCardDirective,
  UbCardFooterDirective,
  UbCardHeaderDirective,
  UbCardTitleDirective,
} from '~/registry/new-york/ui/card'
import { UbInputDirective } from '~/registry/new-york/ui/input'

import { UbLabelDirective } from '~/registry/new-york/ui/label'

@Component({
  standalone: true,
  selector: '[card-with-form-default]',
  imports: [
    UbCardDirective,
    UbCardHeaderDirective,
    UbCardTitleDirective,
    UbCardDescriptionDirective,
    UbCardContentDirective,
    UbCardFooterDirective,

    UbInputDirective,
    UbLabelDirective,
    UbButtonDirective,
  ],
  template: `
    <div ubCard class="w-[350px]">

        <div ubCardHeader>
            <h3 ubCardTitle>Create project</h3>
            <p ubCardDescription>Deploy your new project in one-click.</p>
        </div>

        <div ubCardContent>
            <form>
                <div class="grid w-full items-center gap-4">
                    <div class="flex flex-col space-y-1.5">
                        <label ubLabel htmlFor="name">Name</label>
                        <input ubInput type="text" id="name" placeholder="Name of your project" />
                    </div>
                </div>
            </form>
        </div>

        <div ubCardFooter class="flex justify-between">
            <button ubButton variant="outline">Cancel</button>
            <button ubButton>Deploy</button>
        </div>

    </div>
 `,
})
export default class CardWithFormDefault { }
