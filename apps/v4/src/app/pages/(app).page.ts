import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'

@Component({
  imports: [RouterOutlet, SiteFooter, SiteHeader],
  template: `
  <div class="bg-background relative z-10 flex min-h-svh flex-col">
    <site-header />
    <main class="flex flex-1 flex-col"><router-outlet /></main>
    <site-footer />
  </div>
  `,
})
export default class AppPage {}
