import { computed, Directive, input } from '@angular/core'

import { cn } from '~/lib/utils'

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
    cn('bg-primary/10 animate-pulse rounded-md', this.class()),
  )
}
