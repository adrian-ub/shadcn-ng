import type { VariantProps } from 'class-variance-authority'

import { computed, Directive, input } from '@angular/core'

import { cva } from 'class-variance-authority'
import { cn } from '~/lib/utils'

const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>*>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>*>svg]:gap-x-3 gap-y-0.5 items-start [&>*>svg]:size-4 [&>*>svg]:translate-y-0.5 [&>*>svg]:text-current',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive:
          'border-destructive/50 text-destructive dark:text-destructive-foreground/80 dark:border-destructive [&>*>svg]:text-current dark:bg-destructive/50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

type AlertProps = VariantProps<typeof alertVariants>
type UbAlertVariant = NonNullable<AlertProps['variant']>

@Directive({
  selector: 'div[ubAlert]',
  standalone: true,
  host: {
    'role': 'alert',
    '[class]': 'computedClass()',
    'data-slot': 'alert',
  },
})
export class UbAlertDirective {
  readonly class = input<string>()
  readonly variant = input<UbAlertVariant>('default')

  protected computedClass = computed(() =>
    cn(alertVariants({ variant: this.variant(), class: this.class() })),
  )
}

@Directive({
  selector: 'h5[ubAlertTitle]',
  standalone: true,
  host: {
    '[class]': 'computedClass()',
    'data-slot': 'alert-title',
  },
})
export class UbAlertTitleDirective {
  readonly class = input<string>()

  protected computedClass = computed(() =>
    cn('col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight', this.class()),
  )
}

@Directive({
  selector: 'div[ubAlertDescription]',
  standalone: true,
  host: {
    '[class]': 'computedClass()',
    'data-slot': 'alert-description',
  },
})
export class UbAlertDescriptionDirective {
  readonly class = input<string>()

  protected computedClass = computed(() =>
    cn('col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed', this.class()),
  )
}
