import { Component } from '@angular/core'

import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideArrowRight, lucideLoaderCircle, lucideSend } from '@ng-icons/lucide'

import { UbButtonDirective } from '~/registry/new-york-v4/ui/button'

@Component({
  selector: 'ButtonDemo',
  imports: [UbButtonDirective, NgIcon],
  viewProviders: [provideIcons({ lucideSend, lucideArrowRight, lucideLoaderCircle })],
  template: `
   <div class="flex flex-col gap-6">
      <div class="flex flex-col items-center gap-2 md:flex-row">
        <button ubButton>button</button>
        <button ubButton variant="outline">Outline</button>
        <button ubButton variant="ghost">Ghost</button>
        <button ubButton variant="destructive">Destructive</button>
        <button ubButton variant="secondary">Secondary</button>
        <button ubButton variant="link">Link</button>
        <button ubButton variant="outline">
          <ng-icon name="lucideSend" /> Send
        </button>
        <button ubButton variant="outline">
          Learn More <ng-icon name="lucideArrowRight" />
        </button>
        <button ubButton disabled variant="outline">
          <ng-icon name="lucideLoaderCircle" class="animate-spin" />
          Please wait
        </button>
      </div>
      <div class="flex flex-col items-center gap-2 md:flex-row">
        <button ubButton size="sm">Small</button>
        <button ubButton variant="outline" size="sm">
          Outline
        </button>
        <button ubButton variant="ghost" size="sm">
          Ghost
        </button>
        <button ubButton variant="destructive" size="sm">
          Destructive
        </button>
        <button ubButton variant="secondary" size="sm">
          Secondary
        </button>
        <button ubButton variant="link" size="sm">
          Link
        </button>
        <button ubButton variant="outline" size="sm">
          <ng-icon name="lucideSend" /> Send
        </button>
        <button ubButton variant="outline" size="sm">
          Learn More <ng-icon name="lucideArrowRight" />
        </button>
        <button ubButton disabled size="sm" variant="outline">
          <ng-icon name="lucideLoaderCircle" class="animate-spin" />
          Please wait
        </button>
      </div>
      <div class="flex flex-col flex-wrap items-center gap-2 md:flex-row">
        <button ubButton size="lg">Large</button>
        <button ubButton variant="outline" size="lg">
          Outline
        </button>
        <button ubButton variant="ghost" size="lg">
          Ghost
        </button>
        <button ubButton variant="destructive" size="lg">
          Destructive
        </button>
        <button ubButton variant="secondary" size="lg">
          Secondary
        </button>
        <button ubButton variant="link" size="lg">
          Link
        </button>
        <button ubButton variant="outline" size="lg">
          <ng-icon name="lucideSend" /> Send
        </button>
        <button ubButton variant="outline" size="lg">
          Learn More <ng-icon name="lucideArrowRight" />
        </button>
        <button ubButton disabled size="lg" variant="outline">
          <ng-icon name="lucideLoaderCircle" class="animate-spin" />
          Please wait
        </button>
      </div>
    </div>`,
})
export default class ButtonDemo { }
