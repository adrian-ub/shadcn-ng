import {
  UbAlertDescriptionDirective,
  UbAlertDirective,
  UbAlertIconDirective,
  UbAlertTitleDirective,
} from '@/registry/default/ui/alert.directive'
import { Component } from '@angular/core'
import { NgIconComponent, provideIcons } from '@ng-icons/core'

import { lucideTerminal } from '@ng-icons/lucide'

@Component({
  standalone: true,
  selector: 'alert-demo-default',
  imports: [
    NgIconComponent,
    UbAlertDirective,
    UbAlertTitleDirective,
    UbAlertDescriptionDirective,
    UbAlertIconDirective,
  ],
  viewProviders: [provideIcons({ lucideTerminal })],
  template: `
    <div ubAlert>
      <ng-icon ubAlertIcon name="lucideTerminal" class="h-4 w-4" />
      <h5 ubAlertTitle>Heads up!</h5>
      <div ubAlertDescription>
        You can add components and dependencies to your app using the cli.
      </div>
    </div>
  `,
})
export class AlertDemoDefault { }

export default AlertDemoDefault
