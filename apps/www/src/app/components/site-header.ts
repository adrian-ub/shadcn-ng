import { Component } from '@angular/core'
import { SimpleIconsGithubIcon } from '@ngxi/simple-icons'

import { MainNav } from '~/components/main-nav'
import { MobileNav } from '~/components/mobile-nav'
import { siteConfig } from '~/config/site'
import { UbButtonDirective } from '~/registry/new-york/ui/button'

import { ModeSwitcher } from './mode-switcher'

@Component({
  selector: 'SiteHeader',
  imports: [
    MainNav,
    MobileNav,
    UbButtonDirective,
    ModeSwitcher,
    SimpleIconsGithubIcon,
  ],
  template: `
  <header class="border-grid sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="container-wrapper">
        <div class="container flex h-14 items-center gap-2 md:gap-4">
          <MainNav />
          <MobileNav />
          <div class="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
            <div class="hidden w-full flex-1 md:flex md:w-auto md:flex-none">
              <!-- <CommandMenu /> -->
            </div>
            <nav class="flex items-center gap-0.5">
              <a ubButton variant="ghost" size="icon" class="h-8 w-8 px-0" href="${siteConfig.links.github}" target="_blank" rel="noopener noreferrer">
                <svg simpleIconsGithubIcon class="size-8"></svg>
                <span class="sr-only">GitHub</span>
              </a>
              <ModeSwitcher />
            </nav>
          </div>
        </div>
      </div>
    </header>`,
})
export class SiteHeader { }
