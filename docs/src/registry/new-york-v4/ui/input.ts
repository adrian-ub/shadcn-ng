import { computed, Directive, input } from '@angular/core'

import { cn } from '~/lib/utils'

@Directive({
  selector: '[ubInput]',
  standalone: true,
  host: {
    '[class]': 'computedClass()',
    '[type]': 'type()',
    'data-slot': 'input',
  },
})
export class UbInputDirective<Type extends HTMLInputElement['type'] = HTMLInputElement['type']> {
  readonly type = input.required<Type>()
  readonly class = input<string>()

  protected computedClass = computed(() =>
    cn(
      'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
      'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
      'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
      this.class(),
    ),
  )
}
