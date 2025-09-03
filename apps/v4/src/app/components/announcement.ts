import { Component } from '@angular/core'

import { RouterLink } from '@angular/router'
import { UbBadge } from '@/registry/new-york-v4/ui/badge'

@Component({
  selector: 'announcement',
  imports: [UbBadge, RouterLink],
  template: `
  <a routerLink="/docs/changelog" ubBadge variant="secondary" class="rounded-full">
    Now available: shadcn-ng CLI 2.0 and MCP Server
  </a>
  `,
})
export class Announcement { }
