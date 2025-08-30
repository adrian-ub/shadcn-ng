import type { BooleanInput } from '@angular/cdk/coercion'

import { booleanAttribute, computed, Directive, input } from '@angular/core'
import {
  RdxTabsContentDirective,
  RdxTabsListDirective,
  RdxTabsRootDirective,
  RdxTabsTriggerDirective,
} from '@radix-ng/primitives/tabs'
import { cn } from '@/lib/utils'

@Directive({
  selector: '[ubTabs]',
  standalone: true,
  hostDirectives: [
    {
      directive: RdxTabsRootDirective,
      inputs: ['defaultValue'],
      outputs: ['onValueChange'],
    },
  ],
  host: {
    'data-slot': 'tabs',
    '[class]': 'computedClass()',
  },
})
export class UbTabs {
  class = input<string>()
  protected computedClass = computed(() =>
    cn(
      'flex flex-col gap-2',
      this.class(),
    ),
  )
}

@Directive({
  selector: '[ubTabsList]',
  standalone: true,
  hostDirectives: [RdxTabsListDirective],
  host: {
    'data-slot': 'tabs-list',
    '[class]': 'computedClass()',
  },
})
export class UbTabsList {
  readonly class = input<string>()
  protected computedClass = computed(() =>
    cn(
      'bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]',
      this.class(),
    ),
  )
}

@Directive({
  selector: '[ubTabsTrigger]',
  standalone: true,
  hostDirectives: [
    { directive: RdxTabsTriggerDirective, inputs: ['value: value', 'disabled: disabled'] },
  ],
  host: {
    'data-slot': 'tabs-trigger',
    '[class]': 'computedClass()',
  },
})
export class UbTabsTrigger {
  readonly value = input.required<string>()
  readonly disabled = input<boolean, BooleanInput>(false, {
    transform: booleanAttribute,
  })

  readonly class = input<string>()
  protected computedClass = computed(() =>
    cn(
      'data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
      this.class(),
    ),
  )
}

@Directive({
  selector: '[ubTabsContent]',
  standalone: true,
  hostDirectives: [
    { directive: RdxTabsContentDirective, inputs: ['value: value'] },
  ],
  host: {
    'data-slot': 'tabs-content',
    '[class]': 'computedClass()',
  },
})
export class UbTabsContent {
  readonly value = input.required<string>()

  readonly class = input<string>()
  protected computedClass = computed(() =>
    cn(
      'flex-1 outline-none',
      this.class(),
    ),
  )
}
