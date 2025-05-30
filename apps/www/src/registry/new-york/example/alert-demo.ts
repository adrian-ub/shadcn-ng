import { Component } from '@angular/core'
import { NgIconComponent, provideIcons } from '@ng-icons/core'
import { lucideRocket } from '@ng-icons/lucide'

import {
  UbAlertDescriptionDirective,
  UbAlertDirective,
  UbAlertIconDirective,
  UbAlertTitleDirective,
} from '~/registry/new-york/ui/alert'

@Component({
  standalone: true,
  selector: '[alert-demo-new-york]',
  imports: [
    NgIconComponent,
    UbAlertDirective,
    UbAlertTitleDirective,
    UbAlertDescriptionDirective,
    UbAlertIconDirective,
  ],
  viewProviders: [provideIcons({ lucideRocket })],
  template: `
    <div ubAlert>
      <ng-icon ubAlertIcon name="lucideRocket" class="h-4 w-4" />
      <h5 ubAlertTitle>Heads up!</h5>
      <div ubAlertDescription>
        You can add components and dependencies to your app using the cli.
      </div>
    </div>
  `,
})
export default class AlertDemoNewYork { }
