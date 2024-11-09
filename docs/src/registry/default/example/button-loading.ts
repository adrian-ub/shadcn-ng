import { UbButtonDirective } from '@/registry/default/ui/button'

import { Component } from '@angular/core'
import { NgIconComponent, provideIcons } from '@ng-icons/core'

import { radixReload } from '@ng-icons/radix-icons'

@Component({
  standalone: true,
  selector: '[button-loading-default]',
  imports: [UbButtonDirective, NgIconComponent],
  viewProviders: [provideIcons({ radixReload })],
  template: `
    <button ubButton disabled>
        <ng-icon name="radixReload" class="mr-2 h-4 w-4 animate-spin" /> Please wait
    </button>
    `,
})
export default class ButtonLoadingDefault { }
