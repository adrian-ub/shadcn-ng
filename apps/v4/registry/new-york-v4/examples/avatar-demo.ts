import { Component } from '@angular/core'
import { UbAvatar, UbAvatarFallback, UbAvatarImage } from '@/registry/new-york-v4/ui/avatar'

@Component({
  standalone: true,
  imports: [UbAvatar, UbAvatarImage, UbAvatarFallback],
  template: `
  <div class="flex flex-row flex-wrap items-center gap-12">
    <span ubAvatar>
      <img src="https://github.com/adrian-ub.png" alt="@adrianub" ubAvatarImage />
      <span ubAvatarFallback>UB</span>
    </span>

    <span ubAvatar class="rounded-lg">
      <img src="https://github.com/adrian-ub.png" alt="@adrianub" ubAvatarImage />
      <span ubAvatarFallback>UB</span>
    </span>

    <div class="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
      <span ubAvatar>
        <img src="https://github.com/adrian-ub.png" alt="@adrianub" ubAvatarImage />
        <span ubAvatarFallback>UB</span>
      </span>
      <span ubAvatar>
        <img src="https://github.com/adrian-ub.png" alt="@adrianub" ubAvatarImage />
        <span ubAvatarFallback>UB</span>
      </span>
      <span ubAvatar>
        <img src="https://github.com/adrian-ub.png" alt="@adrianub" ubAvatarImage />
        <span ubAvatarFallback>UB</span>
      </span>
    </div>
  </div>
  `,
})
export class AvatarDemo {}
