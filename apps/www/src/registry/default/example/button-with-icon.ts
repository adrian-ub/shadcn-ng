import { Component } from '@angular/core'

import { NgIconComponent, provideIcons } from '@ng-icons/core'
import { radixEnvelopeOpen } from '@ng-icons/radix-icons'

import { UbButtonDirective } from '~/registry/default/ui/button'

@Component({
  standalone: true,
  selector: '[button-with-icon-default]',
  imports: [UbButtonDirective, NgIconComponent],
  viewProviders: [provideIcons({ radixEnvelopeOpen })],
  template: `
    <button ubButton>
        <ng-icon name="radixEnvelopeOpen" class="mr-2 h-4 w-4" /> Login with Email
    </button>
    `,
})
export default class ButtonWithIconDefault { }
