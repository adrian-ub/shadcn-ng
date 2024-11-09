import { UbButtonDirective } from '@/registry/new-york/ui/button'

import { Component } from '@angular/core'
import { NgIconComponent, provideIcons } from '@ng-icons/core'

import { lucideChevronRight } from '@ng-icons/lucide'

@Component({
  standalone: true,
  selector: '[button-icon-new-york]',
  imports: [UbButtonDirective, NgIconComponent],
  viewProviders: [provideIcons({ lucideChevronRight })],
  template: `
    <button ubButton variant="outline" size="icon">
        <ng-icon name="lucideChevronRight" class="h-4 w-4" />
    </button>
    `,
})
export default class ButtonIconNewYork { }
