import type { RouteMeta } from '@analogjs/router'
import { Component } from '@angular/core'
import { RouterLink, RouterOutlet } from '@angular/router'
import { Announcement } from '@/components/announcement'
import { PageHeader, PageHeaderActions, PageHeaderDescription, PageHeaderHeading } from '@/components/page-header'
import { siteConfig } from '@/lib/config'
import { UbButton } from '@/registry/new-york-v4/ui/button'

const title = 'Tailwind Colors in Every Format'
const description
  = 'The complete Tailwind color palette in HEX, RGB, HSL, CSS variables, and classes. Ready to copy and paste into your project.'

export const routeMeta: RouteMeta = {
  title: `${title} - ${siteConfig.name}`,
  meta: [
    {
      name: 'description',
      content: description,
    },
  ],
}

@Component({
  selector: 'app-colors-layout',
  imports: [
    RouterOutlet,
    Announcement,
    PageHeader,
    PageHeaderHeading,
    PageHeaderActions,
    PageHeaderDescription,
    UbButton,
    RouterLink,
  ],
  template: `
  <div>
    <page-header>
      <announcement />
      <h1 pageHeaderHeading>{{title}}</h1>
      <p pageHeaderDescription>{{description}}</p>
      <div pageHeaderActions>
        <a routerLink="/colors" fragment="colors" ubButton size="sm">Browse Colors</a>
        <a routerLink="/docs/theming" ubButton size="sm" variant="ghost">Documentation</a>
      </div>
    </page-header>
    <div class="container-wrapper">
      <div class="container py-6">
        <section id="colors" class="scroll-mt-20">
          <router-outlet />
        </section>
      </div>
    </div>
  </div>
  `,
})
export default class ColorsLayout {
  protected readonly title = title
  protected readonly description = description
}
