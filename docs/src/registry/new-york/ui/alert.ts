import { cn } from '@/lib/utils'

import { computed, Directive, input } from '@angular/core'

import { cva, type VariantProps } from 'class-variance-authority'

const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm [&>[ubAlertIcon]+div]:translate-y-[-3px] [&>[ubAlertIcon]]:absolute [&>[ubAlertIcon]]:left-4 [&>[ubAlertIcon]]:top-4 [&>[ubAlertIcon]]:text-foreground [&>[ubAlertIcon]~*]:pl-7',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive:
          'border-destructive/50 text-destructive dark:border-destructive [&>[ubAlertIcon]]:text-destructive',
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
  standalone: true,
  selector: '[ubAlertIcon]',
})
export class UbAlertIconDirective {}

@Directive({
  selector: 'h5[ubAlertTitle]',
  standalone: true,
  host: {
    '[class]': 'computedClass()',
  },
})
export class UbAlertTitleDirective {
  readonly class = input<string>()

  protected computedClass = computed(() =>
    cn('mb-1 font-medium leading-none tracking-tight', this.class()),
  )
}

@Directive({
  selector: 'div[ubAlertDescription]',
  standalone: true,
  host: {
    '[class]': 'computedClass()',
  },
})
export class UbAlertDescriptionDirective {
  readonly class = input<string>()

  protected computedClass = computed(() =>
    cn('text-sm [&_p]:leading-relaxed', this.class()),
  )
}
