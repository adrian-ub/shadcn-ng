import {
  UbAlertDescriptionDirective,
  UbAlertDirective,
  UbAlertIconDirective,
  UbAlertTitleDirective,
} from '@/registry/default/ui/alert'
import { Component } from '@angular/core'
import { NgIconComponent, provideIcons } from '@ng-icons/core'

import { lucideTerminal } from '@ng-icons/lucide'

@Component({
  standalone: true,
  selector: '[alert-destructive-default]',
  imports: [
    NgIconComponent,
    UbAlertDirective,
    UbAlertTitleDirective,
    UbAlertDescriptionDirective,
    UbAlertIconDirective,
  ],
  viewProviders: [provideIcons({ lucideTerminal })],
  template: `
    <div ubAlert variant="destructive">
      <ng-icon ubAlertIcon name="lucideTerminal" class="h-4 w-4" />
      <h5 ubAlertTitle>Heads up!</h5>
      <div ubAlertDescription>
        You can add components and dependencies to your app using the cli.
      </div>
    </div>
  `,
})
export default class AlertDestructiveDefault { }
