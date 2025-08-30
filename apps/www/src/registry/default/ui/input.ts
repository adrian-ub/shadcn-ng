import { computed, Directive, input } from '@angular/core'

import { cn } from '~/lib/utils'

export type InputType
  = | 'date'
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
      'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      this.class(),
    ),
  )
}
