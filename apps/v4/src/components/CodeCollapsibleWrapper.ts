import { Component, viewChild } from '@angular/core'
import {
  RdxCollapsibleContentDirective,
  RdxCollapsibleRootDirective,
  RdxCollapsibleTriggerDirective,
} from '@radix-ng/primitives/collapsible'
import { RdxSeparatorRootDirective } from '@radix-ng/primitives/separator'
import { UbButton } from '@/registry/new-york-v4/ui/button'

@Component({
  selector: 'code-collapsible-wrapper',
  imports: [
    UbButton,
    RdxCollapsibleContentDirective,
    RdxCollapsibleRootDirective,
    RdxCollapsibleTriggerDirective,
    RdxSeparatorRootDirective,
  ],
  template: `
  <div #collapsibleRoot="rdxCollapsibleRoot" rdxCollapsibleRoot class="group/collapsible relative md:-mx-1" [open]="true">
    <div class="absolute top-8 right-9 z-10 flex items-center">
      <button class="text-muted-foreground h-7 rounded-md px-2" rdxCollapsibleTrigger ubButton variant="ghost" size="sm">
        @if (collapsibleRoot.open()) {
          Collapse
        } @else {
          Expand
        }
      </button>
      <div rdxSeparatorRoot orientation="vertical" class="mx-1.5 !h-4 bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px"></div>
    </div>
    <div rdxCollapsibleContent class="relative mt-6 overflow-hidden data-[state=closed]:max-h-64 [&>figure]:mt-0 [&>figure]:md:!mx-0" [attr.aria-hidden]="false">
        <ng-content></ng-content>
    </div>
    <div rdxCollapsibleTrigger class="from-code/70 to-code text-muted-foreground absolute inset-x-0 -bottom-2 flex h-20 items-center justify-center rounded-b-lg bg-gradient-to-b text-sm group-data-[state=open]/collapsible:hidden">
      @if (collapsibleRoot.open()) {
        Collapse
      } @else {
        Expand
      }
    </div>
  </div>
  `,
})
export class CodeCollapsibleWrapper {
  collapsibleRoot = viewChild(RdxCollapsibleRootDirective)

  constructor() {
    setTimeout(() => {
      this.collapsibleRoot()!.open.set(false)
    }, 0)
  }
}
