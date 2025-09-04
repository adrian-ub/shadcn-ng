import { Component, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { CommandMenu } from '@/components/command-menu'
import { GithubLink } from '@/components/github-link'
import { MainNav } from '@/components/main-nav'
import { MobileNav } from '@/components/mobile-nav'
import { ModeSwitcher } from '@/components/mode-switcher'
import { SiteConfig } from '@/components/site-config'
import { siteConfig } from '@/lib/config'
import { UbButton } from '@/registry/new-york-v4/ui/button'
import { UbSeparator } from '@/registry/new-york-v4/ui/separator'

@Component({
  selector: 'site-header',
  host: {
    class: 'bg-background sticky top-0 z-50 w-full',
  },
  imports: [
    MobileNav,
    UbButton,
    MainNav,
    CommandMenu,
    GithubLink,
    SiteConfig,
    ModeSwitcher,
    RouterLink,
    UbSeparator,
  ],
  template: `
  <header>
    <div class="container-wrapper 3xl:fixed:px-0 px-6">
      <div class="3xl:fixed:container flex h-(--header-height) items-center gap-2 **:data-[slot=separator]:!h-4">
        <mobile-nav />
        <a routerLink="/" ubButton variant="ghost" size="icon" class="hidden size-8 lg:flex">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" class="size-5">
            <rect width="256" height="256" fill="none"></rect>
            <line
              x1="208"
              y1="128"
              x2="128"
              y2="208"
              fill="none"
              stroke="url(#paint1_linear_1284_572)"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="32"></line>

            <line
              x1="192"
              y1="40"
              x2="40"
              y2="192"
              fill="none"
              stroke="url(#paint3_linear_1284_572)"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="32"></line>

            <defs xmlns="http://www.w3.org/2000/svg">
              <linearGradient
                xmlns="http://www.w3.org/2000/svg"
                id="paint1_linear_1284_572"
                x1="45.4927"
                y1="198.353"
                x2="209.607"
                y2="120.339"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#E40035"></stop>
                <stop offset="0.24" stop-color="#F60A48"></stop>
                <stop offset="0.352" stop-color="#F20755"></stop>
                <stop offset="0.494" stop-color="#DC087D"></stop>
                <stop offset="0.745" stop-color="#9717E7"></stop>
                <stop offset="1" stop-color="#6C00F5"></stop>
              </linearGradient>
              <linearGradient
                xmlns="http://www.w3.org/2000/svg"
                id="paint3_linear_1284_572"
                x1="45.4927"
                y1="198.353"
                x2="209.607"
                y2="120.339"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#E40035"></stop>
                <stop offset="0.24" stop-color="#F60A48"></stop>
                <stop offset="0.352" stop-color="#F20755"></stop>
                <stop offset="0.494" stop-color="#DC087D"></stop>
                <stop offset="0.745" stop-color="#9717E7"></stop>
                <stop offset="1" stop-color="#6C00F5"></stop>
              </linearGradient>
            </defs>
          </svg>
        </a>
        <main-nav class="hidden lg:flex" [navItems]="navItems()" />
        <div class="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
          <div class="hidden w-full flex-1 md:flex md:w-auto md:flex-none">
            <command-menu />
          </div>
          <div ubSeparator orientation="vertical" class="ml-2 hidden lg:block"></div>
          <github-link />
          <div ubSeparator orientation="vertical" class="3xl:flex hidden"></div>
          <site-config class="3xl:flex hidden" />
          <div ubSeparator orientation="vertical"></div>
          <mode-switcher />
        </div>
      </div>
    </div>
  </header>
  `,
})
export class SiteHeader {
  protected readonly navItems = signal(siteConfig.navItems)
}
