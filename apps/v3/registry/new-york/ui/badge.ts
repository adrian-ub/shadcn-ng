import type { VariantProps } from 'class-variance-authority'
import { computed, Directive, input } from '@angular/core'

import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

export const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

type BadgeProps = VariantProps<typeof badgeVariants>

export type UbBadgeVariant = NonNullable<BadgeProps['variant']>

@Directive({
  selector: '[ubBadge]',
  standalone: true,
  host: {
    '[class]': 'computedClass()',
  },
})
export class UbBadgeDirective {
  readonly class = input<string>()
  readonly variant = input<UbBadgeVariant>('default')

  protected computedClass = computed(() =>
    cn(badgeVariants({ variant: this.variant(), class: this.class() })),
  )
}
