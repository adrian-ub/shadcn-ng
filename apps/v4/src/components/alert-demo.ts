import { Component } from '@angular/core'
import { NgIconComponent, provideIcons } from '@ng-icons/core'
import {
  lucideBookmarkCheck,
  lucideCircleAlert,
  lucideCircleCheck,
  lucideGift,
  lucidePopcorn,
  lucideShieldAlert,
} from '@ng-icons/lucide'

import {
  UbAlertDescriptionDirective,
  UbAlertDirective,
  UbAlertTitleDirective,
} from '~/registry/new-york-v4/ui/alert'
import { UbButtonDirective } from '~/registry/new-york-v4/ui/button'

@Component({
  standalone: true,
  selector: '[alert-demo-new-york]',
  imports: [
    NgIconComponent,
    UbAlertDirective,
    UbAlertTitleDirective,
    UbAlertDescriptionDirective,
    UbButtonDirective,
  ],
  viewProviders: [
    provideIcons({
      lucideCircleCheck,
      lucideBookmarkCheck,
      lucidePopcorn,
      lucideShieldAlert,
      lucideGift,
      lucideCircleAlert,
    }),
  ],
  template: `
  <div class="grid max-w-xl items-start gap-4">
    <div ubAlert>
      <ng-icon name="lucideCircleCheck" />
      <h5 ubAlertTitle>Success! Your changes have been saved</h5>
      <div ubAlertDescription>
        This is an alert with icon, title and description.
      </div>
    </div>
    <div ubAlert>
      <ng-icon name="lucideBookmarkCheck" />
      <div ubAlertDescription>
        This one has an icon and a description only. No title.
      </div>
    </div>
    <div ubAlert>
      <div ubAlertDescription>
        This one has a description only. No title. No icon.
      </div>
    </div>
    <div ubAlert>
      <ng-icon name="lucidePopcorn" />
      <h5 ubAlertTitle>Let's try one with icon and title.</h5>
    </div>
    <div ubAlert>
      <ng-icon name="lucideShieldAlert" />
      <h5 ubAlertTitle>
        This is a very long alert title that demonstrates how the component handles extended text content and potentially wraps across multiple lines
      </h5>
    </div>
    <div ubAlert>
      <ng-icon name="lucideGift" />
      <div ubAlertDescription>
        This is a very long alert description that demonstrates how the component handles extended text content and potentially wraps across multiple lines
      </div>
    </div>
    <div ubAlert>
      <ng-icon name="lucideCircleAlert" />
      <h5 ubAlertTitle>
        This is an extremely long alert title that spans multiple lines to demonstrate how the component handles very lengthy headings while maintaining readability and proper text wrapping behavior
      </h5>
      <div ubAlertDescription>
        This is an equally long description that contains detailed information about the alert. It shows how the component can accommodate extensive content while preserving proper spacing, alignment, and readability across different screen sizes and viewport widths. This helps ensure the user experience remains consistent regardless of the content length.
      </div>
    </div>
    <div ubAlert variant="destructive">
      <ng-icon name="lucideCircleAlert" />
      <h5 ubAlertTitle>Something went wrong!</h5>
      <div ubAlertDescription>
        Your session has expired. Please log in again.
      </div>
    </div>
    <div ubAlert variant="destructive">
      <ng-icon name="lucideCircleAlert" />
      <h5 ubAlertTitle>Unable to process your payment.</h5>
      <div ubAlertDescription>
        <p>Please verify your billing information and try again.</p>
        <ul class="list-inside list-disc text-sm">
          <li>Check your card details</li>
          <li>Ensure sufficient funds</li>
          <li>Verify billing address</li>
        </ul>
      </div>
    </div>
    <div ubAlert>
      <ng-icon name="lucideCircleCheck" />
      <h5 ubAlertTitle>The selected emails have been marked as spam.</h5>
      <button ubButton size="sm" variant="outline" class="absolute top-2.5 right-3 h-6 shadow-none">
        Undo
      </button>
    </div>
    <div ubAlert class="border-amber-50 bg-amber-50 text-amber-900 dark:border-amber-950 dark:bg-amber-950 dark:text-amber-100">
      <ng-icon name="lucideCircleCheck" />
      <h5 ubAlertTitle>Plot Twist: This Alert is Actually Amber!</h5>
      <div ubAlertDescription>
        This one has custom colors for light and dark mode.
      </div>
    </div>
  </div>
  `,
})
export default class AlertDemoNewYork { }
