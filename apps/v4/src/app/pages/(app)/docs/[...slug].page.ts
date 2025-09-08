import { MarkdownComponent } from '@analogjs/content'
import { Component } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'

import { DocsToc } from '@/components/docs-toc'
import { injectDoc } from '@/data/docs'
import { UbBadge } from '@/registry/new-york-v4/ui/badge'

@Component({
  selector: 'app-docs-slug',
  imports: [MarkdownComponent, UbBadge, DocsToc],
  template: `
    @if (data(); as doc) {
      <div data-slot="docs" class="flex items-stretch text-[1.05rem] sm:text-[15px] xl:w-full">
        <div class="flex min-w-0 flex-1 flex-col">
          <div class="h-(--top-spacing) shrink-0"></div>
          <div class="mx-auto flex w-full max-w-2xl min-w-0 flex-1 flex-col gap-8 px-4 py-6 text-neutral-800 md:px-0 lg:py-8 dark:text-neutral-300">
            <div class="flex flex-col gap-2">
              <div class="flex flex-col gap-2">
                <div class="flex items-start justify-between">
                  <h1 class="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">
                    {{doc.attributes.title}}
                  </h1>
                  <div class="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
                    <!-- Add pagination -->
                  </div>
                </div>
                @if (doc.attributes.description) {
                  <p class="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
                    {{doc.attributes.description}}
                  </p>
                }
              </div>
              @if (doc.attributes.links) {
                <div class="flex items-center space-x-2 pt-4">
                  @if (doc.attributes.links.doc) {
                    <a ubBadge variant="secondary" [href]="doc.attributes.links.doc" target="_blank" rel="noreferrer">Docs</a>
                  }
                  @if (doc.attributes.links.api) {
                    <a ubBadge variant="secondary" [href]="doc.attributes.links.api" target="_blank" rel="noreferrer">API Reference</a>
                  }
                </div>
              }
            </div>
            <div class="w-full flex-1 *:data-[slot=alert]:first:mt-0">
              <analog-markdown [content]="doc.content"></analog-markdown>
            </div>
          </div>
          <div class="mx-auto hidden h-16 w-full max-w-2xl items-center gap-2 px-4 sm:flex md:px-0">
            <!-- Add pagination -->
          </div>
        </div>

        <div class="sticky top-[calc(var(--header-height)+1px)] z-30 ml-auto hidden h-[calc(100svh-var(--footer-height)+2rem)] w-72 flex-col gap-4 overflow-hidden overscroll-none pb-8 xl:flex">
          <div class="h-(--top-spacing) shrink-0"></div>
          <docs-toc />
        </div>
      </div>
    } @else {
      <p>Not Found.</p>
    }
  `,
})
export default class DocsSlugPage {
  protected readonly data = toSignal(injectDoc())
}
