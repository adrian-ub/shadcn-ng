import { Component } from '@angular/core'

import { lucideAlertCircle, lucideCheckCircle2, lucidePopcorn, NgxiLucide } from '@ngxi/lucide'

import { UbAlert, UbAlertDescription, UbAlertTitle } from '@/registry/new-york-v4/ui/alert'

@Component({
  standalone: true,
  imports: [UbAlert, UbAlertDescription, UbAlertTitle, NgxiLucide],
  template: `
  <div class="grid w-full max-w-xl items-start gap-4">
    <div ubAlert>
      <svg [ngxiLucide]="lucideCheckCircle2"></svg>
      <div ubAlertTitle>Success! Your changes have been saved</div>
      <div ubAlertDescription>This is an alert with icon, title and description.</div>
    </div>
    <div ubAlert>
      <svg [ngxiLucide]="lucidePopcorn"></svg>
      <div ubAlertTitle>This Alert has a title and an icon. No description.</div>
    </div>
    <div ubAlert variant="destructive">
      <svg [ngxiLucide]="lucideAlertCircle"></svg>
      <div ubAlertTitle>Unable to process your payment.</div>
      <div ubAlertDescription>
        <p>Please verify your billing information and try again.</p>
          <ul class="list-inside list-disc text-sm">
            <li>Check your card details</li>
            <li>Ensure sufficient funds</li>
            <li>Verify billing address</li>
          </ul>
      </div>
    </div>
  </div>
  `,
})
export class AlertDemo {
  protected readonly lucideCheckCircle2 = lucideCheckCircle2
  protected readonly lucidePopcorn = lucidePopcorn
  protected readonly lucideAlertCircle = lucideAlertCircle
}
