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
  host: {
    'data-slot': 'accordion',
  },
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
    'data-slot': 'accordion-item',
  },
})
export class UbAccordionItemDirective {
  class = input<ClassValue>()
  computedClass = computed(() => {
    return cn('border-b last:border-b-0', this.class())
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
        <button [class]="computedClass()" data-slot="accordion-trigger">
            <ng-content></ng-content>
            <ng-icon name="lucideChevronDown" class="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200"></ng-icon>
        </button>
    </h3>
    `,
})
export class UbAccordionTriggerDirective {
  class = input<ClassValue>()
  computedClass = computed(() => {
    return cn('ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all hover:underline focus-visible:ring-4 focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&>*>svg]:group-data-[state=open]:rotate-180', this.class())
  })
}

@Component({
  standalone: true,
  selector: '[ubAccordionContent], ub-accordion-content',
  hostDirectives: [RdxAccordionContentDirective],
  host: {
    'class':
      'data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm',
    'data-slot': 'accordion-content',
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
    return cn('pt-0 pb-4', this.class())
  })
}
