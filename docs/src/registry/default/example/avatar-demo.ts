import { UbAvatarDirective, UbAvatarFallbackDirective, UbAvatarImageDirective } from '@/registry/default/ui/avatar'

import { Component } from '@angular/core'

@Component({
  standalone: true,
  selector: 'avatar-demo-default',
  imports: [UbAvatarDirective, UbAvatarImageDirective, UbAvatarFallbackDirective],
  template: `
    <span ubAvatar>
        <img src="https://github.com/adrian-ub.png" alt="@adrianub" ubAvatarImage />
        <span ubAvatarFallback>UB</span>
    </span>
    `,
})
export class AvatarDemoDefault { }

export default AvatarDemoDefault
