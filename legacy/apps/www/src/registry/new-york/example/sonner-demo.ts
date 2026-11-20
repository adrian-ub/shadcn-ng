import { Component } from '@angular/core'
import { toast } from 'ngx-sonner'

import { UbButtonDirective } from '~/registry/new-york/ui/button'
import { ToasterComponent } from '~/registry/new-york/ui/sonner'

@Component({
  standalone: true,
  selector: '[sonner-demo-new-york]',
  imports: [ToasterComponent, UbButtonDirective],
  template: `
    <ub-toaster />
    <button ubButton variant="outline" (click)="onClick()">Show Toast</button>
  `,
})
export default class SonnerDemoNewYork {
  protected onClick(): void {
    toast('Event has been created', {
      description: 'Sunday, December 03, 2023 at 9:00 AM',
      action: {
        label: 'Undo',
        // eslint-disable-next-line no-console
        onClick: () => console.log('Undo'),
      },
    })
  }
}
