import type { VariantProps } from 'class-variance-authority'
import type { buttonVariants } from '@/registry/new-york-v4/ui/button'
import { Clipboard } from '@angular/cdk/clipboard'
import { Component, computed, inject, input, signal } from '@angular/core'

import { lucideCheck, lucideClipboard, NgxiLucide } from '@ngxi/lucide'
import { RdxTooltipArrowDirective, RdxTooltipContentDirective, RdxTooltipRootDirective, RdxTooltipTriggerDirective } from '@radix-ng/primitives/tooltip'
import { cn } from '@/lib/utils'
import { UbButton } from '@/registry/new-york-v4/ui/button'

@Component({
  imports: [
    RdxTooltipRootDirective,
    RdxTooltipTriggerDirective,
    RdxTooltipContentDirective,
    RdxTooltipArrowDirective,
    UbButton,
    NgxiLucide,
  ],
  template: `
    <ng-container rdxTooltipRoot openDelay="0">
      <button ubButton size="icon" [variant]="variant()" type="button" (click)="copyToClipboard()" rdxTooltipTrigger [class]="computedClass()">
        <span class="sr-only">Copy</span>
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
    </ng-container>`,
})
export class CopyButton {
  clipboard = inject(Clipboard)
  value = input('')
  variant = input<VariantProps<typeof buttonVariants>['variant']>('ghost')
  class = signal('')
  computedClass = computed(() =>
    cn('bg-code absolute top-2 right-2 z-10 size-7 hover:opacity-100 focus-visible:opacity-100', this.class()),
  )

  hasCopied = signal(false)

  lucideCheck = lucideCheck
  lucideClipboard = lucideClipboard

  copyToClipboard() {
    this.clipboard.copy(this.value())
    this.hasCopied.set(true)
    setTimeout(() => {
      this.hasCopied.set(false)
    }, 2000)
  }
}
