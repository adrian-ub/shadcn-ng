import type { VariantProps } from 'class-variance-authority'
import { computed, Directive, input } from '@angular/core'

import { cva } from 'class-variance-authority'
import { cn } from '~/lib/utils'

export const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&>*>svg]:size-3 gap-1 [&>*>svg]:pointer-events-none ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 focus-visible:ring-4 focus-visible:outline-1 aria-invalid:focus-visible:ring-0 transition-[color,box-shadow]',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground shadow-sm [a&]:hover:bg-primary/90',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground shadow-sm [a&]:hover:bg-destructive/90',
        outline:
          'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
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
