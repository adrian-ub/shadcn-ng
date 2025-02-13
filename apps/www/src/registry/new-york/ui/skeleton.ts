import { cn } from '@/lib/utils'

import { computed, Directive, input } from '@angular/core'

@Directive({
  selector: '[ubSkeleton]',
  standalone: true,
  host: {
    '[class]': 'computedClass()',
  },
})
export class UbSkeletonDirective {
  readonly class = input<string>()
  protected computedClass = computed(() =>
    cn('animate-pulse rounded-md bg-primary/10', this.class()),
  )
}
