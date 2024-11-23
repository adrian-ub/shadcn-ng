import { cn } from '@/lib/utils'
import { buttonVariants, type UbButtonSize } from '@/registry/default/ui/button'
import { booleanAttribute, Component, computed, Directive, effect, inject, input } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideChevronLeft, lucideChevronRight, lucideEllipsis } from '@ng-icons/lucide'

@Directive({
  standalone: true,
  selector: 'nav[ubPagination]',
  host: {
    'role': 'navigation',
    'aria-label': 'pagination',
    '[class]': 'computedClass()',
  },
})
export class UbPaginationDirective {
  class = input<string>()
  computedClass = computed(() => cn('mx-auto flex w-full justify-center', this.class()))
}

@Directive({
  standalone: true,
  selector: 'ul[ubPaginationContent]',
  host: {
    '[class]': 'computedClass()',
  },
})
export class UbPaginationContentDirective {
  class = input<string>()
  computedClass = computed(() => cn('flex flex-row items-center gap-1', this.class()))
}

@Directive({
  standalone: true,
  selector: 'li[ubPaginationItem]',
  host: {
    '[class]': 'computedClass()',
  },
})
export class UbPaginationItemDirective {
  class = input<string>()
  computedClass = computed(() => cn('', this.class()))
}

@Directive({
  standalone: true,
  selector: '[ubPaginationLink]',
  host: {
    '[aria-current]': 'isActive() ? "page" : undefined',
    '[class]': 'computedClass()',
  },
})
export class UbPaginationLinkDirective {
  class = input<string>()
  isActive = input(false, { transform: booleanAttribute })
  size = input<UbButtonSize>('icon')
  computedClass = computed(() => cn(
    buttonVariants({
      variant: this.isActive() ? 'outline' : 'ghost',
      size: this.size(),
    }),
    this.class(),
  ))
}

@Component({
  standalone: true,
  selector: '[ubPaginationPrevious]',
  imports: [NgIcon],
  hostDirectives: [UbPaginationLinkDirective],
  host: {
    '[class]': 'computedClass()',
    'aria-label': 'Go to previous page',
  },
  providers: [provideIcons({ lucideChevronLeft })],
  template: `
  <ng-icon name="lucideChevronLeft" class="w-4 h-4"></ng-icon>
  <span>Previous</span>
  `,
})
export class UbPaginationPreviousDirective {
  class = input<string>()
  computedClass = computed(() => cn('gap-1 pl-2.5', this.class()))
  protected size = input<UbButtonSize>('default')
  private ubPaginationLinkDirective = inject(UbPaginationLinkDirective, { host: true })

  setConfig = effect(() => {
    this.ubPaginationLinkDirective.size = this.size
  })
}

@Component({
  standalone: true,
  selector: '[ubPaginationNext]',
  imports: [NgIcon],
  providers: [provideIcons({ lucideChevronRight })],
  hostDirectives: [UbPaginationLinkDirective],
  host: {
    '[class]': 'computedClass()',
    'aria-label': 'Go to next page',
  },
  template: `
  <span>Next</span>
  <ng-icon name="lucideChevronRight" class="w-4 h-4"></ng-icon>
  `,
})
export class UbPaginationNextDirective {
  class = input<string>()
  computedClass = computed(() => cn('gap-1 pr-2.5', this.class()))
  protected size = input<UbButtonSize>('default')
  private ubPaginationLinkDirective = inject(UbPaginationLinkDirective, { host: true })

  setConfig = effect(() => {
    this.ubPaginationLinkDirective.size = this.size
  })
}

@Component({
  standalone: true,
  imports: [NgIcon],
  providers: [provideIcons({ lucideEllipsis })],
  selector: 'ub-pagination-ellipsis',
  template: `
  <span
    aria-hidden="true"
    [class]="computedClass()"
  >
    <ng-icon name="lucideEllipsis" class="w-4 h-4"></ng-icon>
    <span class="sr-only">More pages</span>
  </span>
  `,
})
export class UbPaginationEllipsisComponent {
  class = input<string>()
  computedClass = computed(() => cn('flex h-9 w-9 items-center justify-center', this.class()))
}
