import { Component } from '@angular/core'

import { siteConfig } from '~/config/site'

@Component({
  selector: 'SiteFooter',
  template: `
      <footer class="border-grid border-t py-6 md:py-0">
      <div class="container-wrapper">
        <div class="container py-4">
          <div class="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by
            <a
              href="${siteConfig.links.twitter}"
              target="_blank"
              rel="noreferrer"
              class="font-medium underline underline-offset-4"
            >
              Adrián UB
            </a>
            . The source code is available on
            <a
              href="${siteConfig.links.github}"
              target="_blank"
              rel="noreferrer"
              class="font-medium underline underline-offset-4"
            >
              GitHub
            </a>
            .
          </div>
        </div>
      </div>
    </footer>
    `,
})
export class SiteFooter { }
