import type { ClassValue } from 'clsx'
import { Component, computed, Directive, input } from '@angular/core'

import { NgIconComponent, provideIcons } from '@ng-icons/core'
import { lucideChevronDown } from '@ng-icons/lucide'

import {
  RdxAccordionContentDirective,
  RdxAccordionHeaderDirective,
  RdxAccordionItemDirective,
  RdxAccordionRootDirective,
  RdxAccordionTriggerDirective,
} from '@radix-ng/primitives/accordion'
import { cn } from '~/lib/utils'

@Directive({
  standalone: true,
  selector: '[ubAccordion]',
  hostDirectives: [RdxAccordionRootDirective],
})
export class UbAccordionDirective { }

@Directive({
  standalone: true,
  selector: '[ubAccordionItem]',
  hostDirectives: [
    {
      directive: RdxAccordionItemDirective,
      inputs: ['disabled', 'value'],
    },
  ],
  host: {
    '[class]': 'computedClass()',
  },
})
export class UbAccordionItemDirective {
  class = input<ClassValue>()
  computedClass = computed(() => {
    return cn('border-b', this.class())
  })
}

@Component({
  standalone: true,
  selector: '[ubAccordionTrigger], ub-accordion-trigger',
  imports: [RdxAccordionHeaderDirective, NgIconComponent],
  hostDirectives: [RdxAccordionTriggerDirective],
  viewProviders: [provideIcons({ lucideChevronDown })],
  template: `
    <h3 rdxAccordionHeader class="flex group">
        <button [className]="computedClass()">
            <ng-content></ng-content>
            <ng-icon name="lucideChevronDown" class="h-4 w-4 shrink-0 transition-transform duration-200"></ng-icon>
        </button>
    </h3>
    `,
})
export class UbAccordionTriggerDirective {
  class = input<ClassValue>()
  computedClass = computed(() => {
    return cn('flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline group-data-[state=open]:[&>*>svg]:rotate-180', this.class())
  })
}

@Component({
  standalone: true,
  selector: '[ubAccordionContent], ub-accordion-content',
  hostDirectives: [RdxAccordionContentDirective],
  host: {
    class:
            'overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
  },
  template: `
        <div [className]="computedClass()">
            <ng-content></ng-content>
        </div>
    `,
})
export class UbAccordionContentDirective {
  class = input<ClassValue>()
  computedClass = computed(() => {
    return cn('pb-4 pt-0', this.class())
  })
}
