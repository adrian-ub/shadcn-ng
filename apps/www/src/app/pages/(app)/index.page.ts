import type { RouteMeta } from '@analogjs/router'
import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Announcement } from '~/components/announcement'
import { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading } from '~/components/page-header'
import { UbButtonDirective } from '~/registry/new-york/ui/button'

export const routeMeta: RouteMeta = {
  title: 'Build your component library',
}

const title = 'Build your component library'
const description
  = 'A set of beautifully-designed, accessible components and a code distribution platform. Works with your favorite frameworks. Open Source. Open Code.'

@Component({
  selector: 'app-home',
  imports: [
    PageHeader,
    Announcement,
    UbButtonDirective,
    PageHeaderHeading,
    PageHeaderDescription,
    RouterLink,
    PageActions,
  ],
  template: `
      <section pageHeader>
        <Announcement />
        <h1 pageHeaderHeading>${title}</h1>
        <p pageHeaderDescription>${description}</p>
        <div pageActions>
          <button ubButton size="sm">
            <a [routerLink]="['/docs/installation']">Get Started</a>
          </button>
          <!-- <button ubButton size="sm" variant="ghost">
            <a [routerLink]="['/blocks']">Browse Blocks</a>
          </button> -->
        </div>
      </section>
  `,
})
export default class HomeComponent { }
