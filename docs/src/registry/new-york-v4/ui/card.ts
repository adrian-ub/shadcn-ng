import { computed, Directive, input } from '@angular/core'

import { cn } from '~/lib/utils'

@Directive({
  standalone: true,
  selector: 'div[ubCard]',
  host: {
    '[class]': 'computedClass()',
    'data-slot': 'card',
  },
})
export class UbCard {
  readonly class = input<string>()
  protected computedClass = computed(() =>
    cn('bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm', this.class()),
  )
}

@Directive({
  standalone: true,
  selector: 'div[ubCardHeader]',
  host: {
    '[class]': 'computedClass()',
    'data-slot': 'card-header',
  },
})
export class UbCardHeader {
  readonly class = input<string>()
  protected computedClass = computed(() =>
    cn('@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6', this.class()),
  )
}

@Directive({
  standalone: true,
  selector: 'h3[ubCardTitle]',
  host: {
    '[class]': 'computedClass()',
    'data-slot': 'card-title',
  },
})
export class UbCardTitle {
  readonly class = input<string>()
  protected computedClass = computed(() =>
    cn('leading-none font-semibold', this.class()),
  )
}

@Directive({
  standalone: true,
  selector: 'p[ubCardDescription]',
  host: {
    '[class]': 'computedClass()',
    'data-slot': 'card-description',
  },
})
export class UbCardDescription {
  readonly class = input<string>()
  protected computedClass = computed(() =>
    cn('text-muted-foreground text-sm', this.class()),
  )
}

@Directive({
  standalone: true,
  selector: 'p[ubCardAction]',
  host: {
    '[class]': 'computedClass()',
    'data-slot': 'card-action',
  },
})
export class UbCardAction {
  readonly class = input<string>()
  protected computedClass = computed(() =>
    cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', this.class()),
  )
}

@Directive({
  standalone: true,
  selector: 'div[ubCardContent]',
  host: {
    '[class]': 'computedClass()',
    'data-slot': 'card-content',
  },
})
export class UbCardContent {
  readonly class = input<string>()
  protected computedClass = computed(() => cn('px-6', this.class()))
}

@Directive({
  standalone: true,
  selector: 'div[ubCardFooter]',
  host: {
    '[class]': 'computedClass()',
    'data-slot': 'card-footer',
  },
})
export class UbCardFooter {
  readonly class = input<string>()
  protected computedClass = computed(() =>
    cn('flex items-center px-6 [.border-t]:pt-6', this.class()),
  )
}
