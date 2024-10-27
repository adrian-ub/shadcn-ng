import { UbButtonDirective } from '@/registry/default/ui/button'
import { ToasterComponent } from '@/registry/default/ui/sonner'

import { Component } from '@angular/core'
import { toast } from 'ngx-sonner'

@Component({
  standalone: true,
  selector: 'sonner-demo-default',
  imports: [ToasterComponent, UbButtonDirective],
  template: `
    <ub-toaster />
    <button ubButton variant="outline" (click)="onClick()">Show Toast</button>
  `,
})
export class SonnerDemoDefault {
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

export default SonnerDemoDefault