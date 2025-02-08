import { computed, Directive, input } from '@angular/core'

import { cn } from '~/lib/utils'

@Directive({
  standalone: true,
  selector: 'div[ubCard]',
  host: {
    '[class]': 'computedClass()',
  },
})
export class UbCardDirective {
  readonly class = input<string>()
  protected computedClass = computed(() =>
    cn('bg-card text-card-foreground rounded-xl border shadow-sm', this.class()),
  )
}

@Directive({
  standalone: true,
  selector: 'div[ubCardHeader]',
  host: {
    '[class]': 'computedClass()',
  },
})
export class UbCardHeaderDirective {
  readonly class = input<string>()
  protected computedClass = computed(() =>
    cn('flex flex-col gap-1.5 p-6', this.class()),
  )
}

@Directive({
  standalone: true,
  selector: 'h3[ubCardTitle]',
  host: {
    '[class]': 'computedClass()',
  },
})
export class UbCardTitleDirective {
  readonly class = input<string>()
  protected computedClass = computed(() =>
    cn('leading-none font-semibold tracking-tight', this.class()),
  )
}

@Directive({
  standalone: true,
  selector: 'p[ubCardDescription]',
  host: {
    '[class]': 'computedClass()',
  },
})
export class UbCardDescriptionDirective {
  readonly class = input<string>()
  protected computedClass = computed(() =>
    cn('text-muted-foreground text-sm', this.class()),
  )
}

@Directive({
  standalone: true,
  selector: 'div[ubCardContent]',
  host: {
    '[class]': 'computedClass()',
  },
})
export class UbCardContentDirective {
  readonly class = input<string>()
  protected computedClass = computed(() => cn('p-6 pt-0', this.class()))
}

@Directive({
  standalone: true,
  selector: 'div[ubCardFooter]',
  host: {
    '[class]': 'computedClass()',
  },
})
export class UbCardFooterDirective {
  readonly class = input<string>()
  protected computedClass = computed(() =>
    cn('flex items-center p-6 pt-0', this.class()),
  )
}
