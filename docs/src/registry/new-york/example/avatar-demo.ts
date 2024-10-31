import { UbAvatarDirective, UbAvatarFallbackDirective, UbAvatarImageDirective } from '@/registry/new-york/ui/avatar'

import { Component } from '@angular/core'

@Component({
  standalone: true,
  selector: 'avatar-demo-new-york',
  imports: [UbAvatarDirective, UbAvatarImageDirective, UbAvatarFallbackDirective],
  template: `
    <span ubAvatar>
        <img src="https://github.com/adrian-ub.png" alt="@adrianub" ubAvatarImage />
        <span ubAvatarFallback>UB</span>
    </span>
    `,
})
export default class AvatarDemoNewYork { }
