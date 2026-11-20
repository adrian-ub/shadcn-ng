import { Component } from '@angular/core'

import { NgIconComponent, provideIcons } from '@ng-icons/core'
import { radixReload } from '@ng-icons/radix-icons'

import { UbButtonDirective } from '~/registry/new-york/ui/button'

@Component({
  standalone: true,
  selector: '[button-loading-new-york]',
  imports: [UbButtonDirective, NgIconComponent],
  viewProviders: [provideIcons({ radixReload })],
  template: `
    <button ubButton disabled>
        <ng-icon name="radixReload" class="mr-2 h-4 w-4 animate-spin" /> Please wait
    </button>
    `,
})
export default class ButtonLoadingNewYork { }
