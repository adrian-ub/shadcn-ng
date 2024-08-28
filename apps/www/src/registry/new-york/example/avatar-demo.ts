import { Component } from '@angular/core';

import { UbAvatarDirective, UbAvatarImageDirective, UbAvatarFallbackDirective } from '@/registry/new-york/ui/avatar.directive'

@Component({
    standalone: true,
    selector: 'avatar-demo-new-york',
    imports: [UbAvatarDirective, UbAvatarImageDirective, UbAvatarFallbackDirective],
    template: `
    <span ubAvatar>
        <img src="https://github.com/adrian-ub.png" alt="@adrianub" ubAvatarImage />
        <span ubAvatarFallback>UB</span>
    </span>
    `
})
export class AvatarDemoNewYork { }

export default AvatarDemoNewYork;
