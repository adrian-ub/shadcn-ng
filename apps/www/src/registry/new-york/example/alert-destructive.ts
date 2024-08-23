import { Component } from "@angular/core";
import { NgIconComponent, provideIcons } from "@ng-icons/core";
import { lucideRocket } from "@ng-icons/lucide";

import {
    UbAlertDirective,
    UbAlertTitleDirective,
    UbAlertDescriptionDirective,
    UbAlertIconDirective,
} from "@/registry/new-york/ui/alert.directive";

@Component({
    standalone: true,
    selector: "alert-destructive-new-york",
    imports: [
        NgIconComponent,
        UbAlertDirective,
        UbAlertTitleDirective,
        UbAlertDescriptionDirective,
        UbAlertIconDirective,
    ],
    viewProviders: [provideIcons({ lucideRocket })],
    template: `
    <div ubAlert variant="destructive">
      <ng-icon ubAlertIcon name="lucideRocket" class="h-4 w-4" />
      <h5 ubAlertTitle>Heads up!</h5>
      <div ubAlertDescription>
        You can add components and dependencies to your app using the cli.
      </div>
    </div>
  `,
})
export class AlertDestructiveNewYork { }

export default AlertDestructiveNewYork;
