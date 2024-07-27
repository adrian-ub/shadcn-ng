import { Component } from "@angular/core";
import { NgIconComponent, provideIcons } from "@ng-icons/core";
import { lucideTerminal } from "@ng-icons/lucide";

import {
  UbAlertDirective,
  UbAlertTitleDirective,
  UbAlertDescriptionDirective,
} from "@/registry/new-york/ui/alert.directive";

@Component({
  standalone: true,
  imports: [
    NgIconComponent,
    UbAlertDirective,
    UbAlertTitleDirective,
    UbAlertDescriptionDirective,
  ],
  viewProviders: [provideIcons({ lucideTerminal })],
  template: `
    <div ubAlert variant="destructive">
      <ng-icon name="lucideTerminal" class="h-4 w-4" />
      <h5 ubAlertTitle>Heads up!</h5>
      <div ubAlertDescription>
        You can add components and dependencies to your app using the cli.
      </div>
    </div>
  `,
})
export class AlertDemoComponent {}

export default AlertDemoComponent;
