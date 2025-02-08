import { computed, Directive, input } from '@angular/core'

import { cn } from '~/lib/utils'

@Directive({
  standalone: true,
  selector: '[ubTextarea]',
  host: {
    '[class]': 'computedClass()',
  },
})
export class UbTextAreaDirective {
  class = input<string>()
  computedClass = computed(() =>
    cn('flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm', this.class()),
  )
}
