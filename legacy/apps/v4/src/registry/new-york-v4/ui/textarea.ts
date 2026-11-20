import { computed, Directive, input } from '@angular/core'

import { cn } from '~/lib/utils'

@Directive({
  standalone: true,
  selector: 'textarea[ubTextarea]',
  host: {
    '[class]': 'computedClass()',
  },
})
export class UbTextAreaDirective {
  class = input<string>()
  computedClass = computed(() =>
    cn('border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm', this.class()),
  )
}
