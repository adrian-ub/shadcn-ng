import { Clipboard } from '@angular/cdk/clipboard'
import { Component, computed, inject, input, signal } from '@angular/core'
import { lucideCheck, lucideClipboard, lucideTerminal, NgxiLucide } from '@ngxi/lucide'

import { RdxTooltipArrowDirective, RdxTooltipContentDirective, RdxTooltipRootDirective, RdxTooltipTriggerDirective } from '@radix-ng/primitives/tooltip'
import { UbButton } from '@/registry/new-york-v4/ui/button'
import { UbTabs, UbTabsContent, UbTabsList, UbTabsTrigger } from '@/registry/new-york-v4/ui/tabs'

@Component({
  selector: 'code-block-command',
  imports: [
    UbTabsContent,
    UbTabs,
    UbTabsList,
    UbTabsTrigger,
    RdxTooltipRootDirective,
    RdxTooltipTriggerDirective,
    RdxTooltipContentDirective,
    RdxTooltipArrowDirective,
    UbButton,
    NgxiLucide,
  ],
  template: `
  <div class="overflow-x-auto">
    <div ubTabs class="gap-0" (onValueChange)="handleTabChange($event)" [defaultValue]="selectedCommand()">
      <div class="border-border/50 flex items-center gap-2 border-b px-3 py-1">
        <div class="bg-foreground flex size-4 items-center justify-center rounded-[1px] opacity-70">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-code size-3">
            <polyline points="4 17 10 11 4 5"></polyline>
            <line x1="12" x2="20" y1="19" y2="19"></line>
          </svg>
        </div>
        <div ubTabsList class="rounded-none bg-transparent p-0">
          @for (item of tabs(); track $index) {
            <button ubTabsTrigger [value]="item[0]">{{ item[0] }}</button>
          }
        </div>
      </div>

      <div class="no-scrollbar overflow-x-auto">
        @for (item of tabs(); track $index) {
          <section ubTabsContent [value]="item[0]" class="mt-0 px-4 py-3.5">
            <pre><code class="relative font-mono text-sm leading-none" data-language="bash">{{ item[1] }}</code></pre>
          </section>
        }
      </div>
    </div>
    <ng-container rdxTooltipRoot openDelay="0">
      <button ubButton size="icon" variant="ghost" type="button" (click)="copyToClipboard()" rdxTooltipTrigger class="absolute top-2 right-2 z-10 size-7 opacity-70 hover:opacity-100 focus-visible:opacity-100">
        @if(hasCopied()) {
          <svg [ngxiLucide]="lucideCheck"></svg>
        } @else {
          <svg [ngxiLucide]="lucideClipboard"></svg>
        }
      </button>
      <ng-template rdxTooltipContent>
        <div class="bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance">
          {{hasCopied() ? "Copied" : "Copy to Clipboard"}}
        </div>
        <div rdxTooltipArrow class="bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]"></div>
      </ng-template>
    </ng-container>
  </div>
  `,
})
export class CodeBlockCommand {
  readonly clipboard = inject(Clipboard)
  lucideTerminal = lucideTerminal
  lucideCheck = lucideCheck
  lucideClipboard = lucideClipboard
  readonly __npm__ = input('')
  readonly __yarn__ = input('')
  readonly __pnpm__ = input('')
  readonly __bun__ = input('')
  readonly selectedCommand = signal('pnpm')
  readonly hasCopied = signal(false)

  tabs = computed(() => Object.entries({
    pnpm: this.__pnpm__(),
    npm: this.__npm__(),
    yarn: this.__yarn__(),
    bun: this.__bun__(),
  }))

  handleTabChange(event: any) {
    this.selectedCommand.set(event)
  }

  copyToClipboard() {
    const command = this.tabs().find(item => item[0] === this.selectedCommand())?.[1] || ''
    this.clipboard.copy(command)
    this.hasCopied.set(true)
    setTimeout(() => {
      this.hasCopied.set(false)
    }, 2000)
  }
}
