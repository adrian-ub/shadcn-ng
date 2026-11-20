import { Component } from '@angular/core'
import { UbAvatarDirective, UbAvatarFallbackDirective, UbAvatarImageDirective } from '~/registry/new-york-v4/ui/avatar'

@Component({
  selector: 'AvatarDemo',
  imports: [UbAvatarDirective, UbAvatarImageDirective, UbAvatarFallbackDirective],
  template: `
  <div class="flex flex-col items-center gap-4 md:flex-row">
    <span ubAvatar>
      <img src="https://github.com/adrian-ub.png" ubAvatarImage alt="adrianub" />
      <span ubAvatarFallback>UB</span>
    </span>
    <span ubAvatar>
      <span ubAvatarFallback>UB</span>
    </span>
    <span ubAvatar class="size-12">
      <img src="https://github.com/adrian-ub.png" ubAvatarImage alt="adrianub" />
      <span ubAvatarFallback>UB</span>
    </span>
    <span ubAvatar class="rounded-lg">
      <img src="https://github.com/adrian-ub.png" ubAvatarImage alt="adrianub" />
      <span ubAvatarFallback>UB</span>
    </span>
    <div class="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
      <span ubAvatar>
        <img src="https://github.com/adrian-ub.png" ubAvatarImage alt="adrianub" />
        <span ubAvatarFallback>UB</span>
      </span>
      <span ubAvatar>
        <img src="https://github.com/adrian-ub.png" ubAvatarImage alt="adrianub" />
        <span ubAvatarFallback>UB</span>
      </span>
      <span ubAvatar>
        <img src="https://github.com/adrian-ub.png" ubAvatarImage alt="adrianub" />
        <span ubAvatarFallback>UB</span>
      </span>
    </div>
    <div class="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:size-12 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
      <span ubAvatar>
        <img src="https://github.com/adrian-ub.png" ubAvatarImage alt="adrianub" />
        <span ubAvatarFallback>UB</span>
      </span>
      <span ubAvatar>
        <img src="https://github.com/adrian-ub.png" ubAvatarImage alt="adrianub" />
        <span ubAvatarFallback>UB</span>
      </span>
      <span ubAvatar>
        <img src="https://github.com/adrian-ub.png" ubAvatarImage alt="adrianub" />
        <span ubAvatarFallback>UB</span>
      </span>
    </div>
    <div class="*:data-[slot=avatar]:ring-background flex -space-x-2 hover:space-x-1 *:data-[slot=avatar]:size-12 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale *:data-[slot=avatar]:transition-all *:data-[slot=avatar]:duration-300 *:data-[slot=avatar]:ease-in-out">
      <span ubAvatar>
        <img src="https://github.com/adrian-ub.png" ubAvatarImage alt="adrianub" />
        <span ubAvatarFallback>UB</span>
      </span>
      <span ubAvatar>
        <img src="https://github.com/adrian-ub.png" ubAvatarImage alt="adrianub" />
        <span ubAvatarFallback>UB</span>
      </span>
      <span ubAvatar>
        <img src="https://github.com/adrian-ub.png" ubAvatarImage alt="adrianub" />
        <span ubAvatarFallback>UB</span>
      </span>
    </div>
  </div>
  `,
})
export default class AvatarDemo { }
