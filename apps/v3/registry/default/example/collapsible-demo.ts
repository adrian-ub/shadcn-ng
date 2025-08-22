import { Component } from '@angular/core'

import { NgIconComponent, provideIcons } from '@ng-icons/core'

import { radixCaretSort } from '@ng-icons/radix-icons'

import { UbButtonDirective } from '@/registry/new-york/ui/button'
import { UbCollapsible, UbCollapsibleContent, UbCollapsibleTrigger } from '@/registry/new-york/ui/collapsible'

@Component({
  standalone: true,
  selector: '[collapsible-demo-default]',
  imports: [UbCollapsible, UbCollapsibleContent, UbCollapsibleTrigger, UbButtonDirective, NgIconComponent],
  viewProviders: [provideIcons({ radixCaretSort })],
  template: `
  <div ubCollapsible class="w-[350px] space-y-2" [open]="false">
    <div class="flex items-center justify-between space-x-4 px-4">
        <h4 className="text-sm font-semibold">
          {{'@'}}peduarte starred 3 repositories
        </h4>
        <button ubButton variant="ghost" size="sm" ubCollapsibleTrigger>
          <ng-icon name="radix-caret-sort" class="h-4 w-4"></ng-icon>
          <span class="sr-only">Toggle</span>
        </button>
    </div>
    <div class="rounded-md border px-4 py-2 font-mono text-sm shadow-sm">
      {{'@'}}radix-ng/primitives
    </div>

    <div ubCollapsibleContent>
      <div class="rounded-md border px-4 py-2 font-mono text-sm shadow-sm">
        {{'@'}}radix-ng/colors
      </div>
      <div class="rounded-md border px-4 py-2 font-mono text-sm shadow-sm">
        {{'@'}}angular/core
      </div>
    </div>
  </div>
  `,
})
export default class CollapSibleDemoDefault { }
