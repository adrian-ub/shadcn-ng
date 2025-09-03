import { Component } from '@angular/core'

@Component({
  selector: 'site-footer',
  template: `
  <footer class="group-has-[.section-soft]/body:bg-surface/40 3xl:fixed:bg-transparent group-has-[.docs-nav]/body:pb-20 group-has-[.docs-nav]/body:sm:pb-0 dark:bg-transparent">
    <div class="container-wrapper px-4 xl:px-6">
      <div class="flex h-(--footer-height) items-center justify-between">
        <div class="text-muted-foreground w-full px-1 text-center text-xs leading-loose sm:text-sm">
          Built by <a href="" target="_blank" rel="noreferrer" class="font-medium underline underline-offset-4">shadcn</a>
        </div>
      </div>
    </div>
  </footer>
  `,
})
export class SiteFooter { }
