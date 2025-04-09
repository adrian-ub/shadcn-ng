import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'

import { LogoIcon } from '~/components/icons/logo-icon'
import { siteConfig } from '~/config/site'

@Component({
  selector: 'MainNav',
  imports: [RouterLink, LogoIcon],
  template: `
  <div class="mr-4 hidden md:flex">
    <a [routerLink]="['/']" class="mr-4 flex items-center gap-2 lg:mr-6">
      <svg logoIcon></svg>
      <span class="hidden font-bold lg:inline-block">${siteConfig.name}</span>
    </a>
    <nav class="flex items-center gap-4 text-sm xl:gap-6">
      <a [routerLink]="['/docs/installation']" class="transition-colors hover:text-foreground/80 text-foreground/80" routerLinkActive="text-foreground">
        Docs
      </a>
      <a [routerLink]="['/docs/components']" class="transition-colors hover:text-foreground/80 text-foreground/80" routerLinkActive="text-foreground">
        Components
      </a>
      <a [routerLink]="['/colors']" class="transition-colors hover:text-foreground/80 text-foreground/80" routerLinkActive="text-foreground">
        Colors
      </a>
    </nav>
  </div>
  `,
})
export class MainNav { }
