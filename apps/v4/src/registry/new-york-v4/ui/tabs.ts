import type { BooleanInput } from '@angular/cdk/coercion'

import { booleanAttribute, computed, Directive, input } from '@angular/core'
import {
  RdxTabsContentDirective,
  RdxTabsListDirective,
  RdxTabsRootDirective,
  RdxTabsTriggerDirective,
} from '@radix-ng/primitives/tabs'
import { cn } from '~/lib/utils'

@Directive({
  selector: '[ubTabs]',
  standalone: true,
  host: {
    '[class]': 'computedClass()',
  },
  hostDirectives: [
    {
      directive: RdxTabsRootDirective,
      inputs: ['defaultValue'],
    },
  ],
})
export class UbTabsDirective {
  class = input<string>()
  computedClass = computed(() => cn('flex flex-col gap-2', this.class()))
}

@Directive({
  selector: '[ubTabsList]',
  standalone: true,
  hostDirectives: [RdxTabsListDirective],
  host: {
    '[class]': 'computedClass()',
  },
})
export class UbTabsListDirective {
  readonly class = input<string>()
  protected computedClass = computed(() =>
    cn(
      'bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-1',
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
    '[class]': 'computedClass()',
  },
})
export class UbTabsTriggerDirective {
  readonly value = input.required<string>()
  readonly disabled = input<boolean, BooleanInput>(false, {
    transform: booleanAttribute,
  })

  readonly class = input<string>()
  protected computedClass = computed(() =>
    cn(
      'data-[state=active]:bg-background data-[state=active]:text-foreground ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 inline-flex items-center justify-center gap-2 rounded-md px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 aria-invalid:focus-visible:ring-0 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
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
    '[class]': 'computedClass()',
  },
})
export class UbTabsContentDirective {
  readonly value = input.required<string>()

  readonly class = input<string>()
  protected computedClass = computed(() =>
    cn(
      'ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 flex-1 transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1 aria-invalid:focus-visible:ring-0',
      this.class(),
    ),
  )
}
