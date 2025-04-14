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
    cn('animate-pulse rounded-md bg-muted', this.class()),
  )
}
