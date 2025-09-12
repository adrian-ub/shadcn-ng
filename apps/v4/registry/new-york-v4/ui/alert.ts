import type { VariantProps } from 'class-variance-authority'

import { computed, Directive, input } from '@angular/core'

import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current',
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground',
        destructive:
          'text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

@Directive({
  standalone: true,
  selector: 'div[ubAlert], ub-alert',
  host: {
    'role': 'alert',
    '[class]': 'computedClass()',
    'data-slot': 'alert',
  },
})
export class UbAlert {
  readonly class = input<string>()
  readonly variant = input<VariantProps<typeof alertVariants>['variant']>('default')

  protected readonly computedClass = computed(() =>
    cn(alertVariants({ variant: this.variant(), class: this.class() })),
  )
}

@Directive({
  standalone: true,
  selector: 'div[ubAlertTitle], ub-alert-title',
  host: {
    '[class]': 'computedClass()',
    'data-slot': 'alert-title',
  },
})
export class UbAlertTitle {
  readonly class = input<string>()
  protected readonly computedClass = computed(() =>
    cn('col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight', this.class()),
  )
}

@Directive({
  standalone: true,
  selector: 'div[ubAlertDescription], ub-alert-description',
  host: {
    'data-slot': 'alert-description',
    '[class]': 'computedClass()',
  },
})
export class UbAlertDescription {
  readonly class = input<string>()
  protected readonly computedClass = computed(() =>
    cn('text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed', this.class()),
  )
}
