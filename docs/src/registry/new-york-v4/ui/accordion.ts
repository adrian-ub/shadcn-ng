import { Component, computed, Directive, input } from '@angular/core'

import { lucideChevronDown, NgxiLucide } from '@ngxi/lucide'
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
  selector: '[ubAccordion], ub-accordion',
  host: {
    'data-slot': 'accordion',
  },
  hostDirectives: [
    {
      directive: RdxAccordionRootDirective,
      inputs: ['type', 'collapsible', 'defaultValue', 'value', 'id', 'dir', 'disabled', 'orientation'],
      outputs: ['onValueChange'],
    },
  ],
})
export class UbAccordion { }

@Directive({
  standalone: true,
  selector: '[ubAccordionItem], ub-accordion-item',
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
export class UbAccordionItem {
  readonly class = input<string>()
  readonly computedClass = computed(() => {
    return cn('border-b last:border-b-0', this.class())
  })
}

@Component({
  standalone: true,
  selector: '[ubAccordionTrigger], ub-accordion-trigger',
  imports: [RdxAccordionHeaderDirective, NgxiLucide, RdxAccordionTriggerDirective],
  template: `
    <h3 rdxAccordionHeader class="flex">
      <button [class]="computedClass()" data-slot="accordion-trigger" rdxAccordionTrigger>
        <ng-content></ng-content>
        <svg [ngxiLucide]="lucideChevronDown" class="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200"></svg>
      </button>
    </h3>
    `,
})
export class UbAccordionTrigger {
  readonly lucideChevronDown = lucideChevronDown
  readonly class = input<string>()
  readonly computedClass = computed(() => {
    return cn('focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180', this.class())
  })
}

@Component({
  standalone: true,
  selector: '[ubAccordionContent], ub-accordion-content',
  hostDirectives: [RdxAccordionContentDirective],
  host: {
    'data-slot': 'accordion-content',
    'class':
      'data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm',
  },
  template: `
    <div [class]="computedClass()">
      <ng-content></ng-content>
    </div>
    `,
})
export class UbAccordionContent {
  readonly class = input<string>()
  readonly computedClass = computed(() => {
    return cn('pt-0 pb-4', this.class())
  })
}
