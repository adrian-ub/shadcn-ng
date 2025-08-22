import { Component } from '@angular/core'

import { NgIconComponent, provideIcons } from '@ng-icons/core'
import { lucideBold } from '@ng-icons/lucide'
import { UbToggleDirective } from '@/registry/default/ui/toggle'

@Component({
  standalone: true,
  selector: '[toggle-demo-default]',
  imports: [UbToggleDirective, NgIconComponent],
  viewProviders: [provideIcons({ lucideBold })],
  template: `
    <button ubToggle>
      <ng-icon name="lucideBold" class="h-4 w-4"></ng-icon>
    </button>
  `,
})
export default class ToggleDemoDefault { }
