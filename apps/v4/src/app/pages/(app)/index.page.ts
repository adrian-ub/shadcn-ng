import type { RouteMeta } from '@analogjs/router'
import { Component } from '@angular/core'
import { Announcement } from '@/components/announcement'
import { PageHeader, PageHeaderActions, PageHeaderDescription, PageHeaderHeading } from '@/components/page-header'
import { siteConfig } from '@/lib/config'
import { UbButton } from '@/registry/new-york-v4/ui/button'

const title = 'The Foundation for your Design System'
const description
  = 'A set of beautifully designed components that you can customize, extend, and build on. Start here then make it your own. Open Source. Open Code.'

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
  selector: 'app-index',
  imports: [
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading,
    PageHeaderActions,
    Announcement,
    UbButton,
  ],
  template: `
  <div class="flex flex-1 flex-col">
    <page-header>
      <announcement />
      <h1 pageHeaderHeading class="max-w-4xl">${title}</h1>
      <p pageHeaderDescription>${description}</p>
      <div pageHeaderActions>
        <a href="/docs/installation" ubButton size="sm">Get Started</a>
        <a href="/docs/components" ubButton size="sm" variant="ghost">View Components</a>
      </div>
    </page-header>
  </div>
  `,
})
export default class IndexPage { }
