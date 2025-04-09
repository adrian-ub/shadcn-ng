import type { RouteMeta } from '@analogjs/router'
import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

import { SiteFooter } from '~/components/site-footer'
import { SiteHeader } from '~/components/site-header'
import { META_THEME_COLORS, siteConfig } from '~/config/site'

export const routeMeta: RouteMeta = {
  title: siteConfig.name,
  meta: [
    {
      name: 'description',
      content: siteConfig.description,
    },
    {
      name: 'theme-color',
      content: META_THEME_COLORS.dark,
    },
    {
      name: 'keywords',
      content: [
        'Angular',
        'Analog',
        'Tailwind CSS',
        'Radix Angular',
      ].join(','),
    },
    {
      name: 'author',
      content: 'Adrián UB',
    },
    {
      name: 'creator',
      content: 'Adrián UB',
    },
  ],
}

@Component({
  selector: 'app-app',
  imports: [
    RouterOutlet,
    SiteFooter,
    SiteHeader,
  ],
  template: `
    <div class="border-grid flex flex-1 flex-col">
      <SiteHeader />
      <main class="flex flex-1 flex-col">
        <router-outlet />
      </main>
      <SiteFooter />
    </div>
  `,
})
export default class AppLayoutPageComponent { }
