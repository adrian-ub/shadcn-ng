import { cn } from '@/lib/utils'

import { computed, Directive, input } from '@angular/core'

export type InputType =
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'month'
  | 'number'
  | 'password'
  | 'tel'
  | 'file'
  | 'search'
  | 'text'

@Directive({
  selector: '[ubInput]',
  standalone: true,
  host: {
    '[class]': 'computedClass()',
    '[type]': 'type()',
  },
})
export class UbInputDirective<Type extends InputType> {
  readonly type = input.required<Type>()
  readonly class = input<string>()

  protected computedClass = computed(() =>
    cn(
      'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
      this.class(),
    ),
  )
}
