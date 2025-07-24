import { Component, computed, Directive, input } from '@angular/core'

import { lucideChevronRight, lucideMoreHorizontal, NgxiLucide } from '@ngxi/lucide'

import { cn } from '~/lib/utils'

@Directive({
  selector: 'nav[ubBreadcrumb]',
  standalone: true,
  host: {
    'aria-label': 'breadcrumb',
    'data-slot': 'breadcrumb',
  },
})
export class UbBreadcrumb { }

@Directive({
  selector: 'ol[ubBreadcrumbList]',
  standalone: true,
  host: {
    '[class]': 'computedClass()',
    'data-slot': 'breadcrumb-list',
  },
})
export class UbBreadcrumbList {
  readonly class = input<string>()

  protected computedClass = computed(() =>
    cn(
      'text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5',
      this.class(),
    ),
  )
}

@Directive({
  selector: 'li[ubBreadcrumbItem]',
  standalone: true,
  host: {
    '[class]': 'computedClass()',
    'data-slot': 'breadcrumb-item',
  },
})
export class UbBreadcrumbItem {
  readonly class = input<string>()

  protected computedClass = computed(() =>
    cn('inline-flex items-center gap-1.5', this.class()),
  )
}

@Directive({
  selector: '[ubBreadcrumbLink]',
  standalone: true,
  host: {
    '[class]': 'computedClass()',
    'data-slot': 'breadcrumb-link',
  },
})
export class UbBreadcrumbLink {
  readonly class = input<string>()

  protected computedClass = computed(() =>
    cn('hover:text-foreground transition-colors', this.class()),
  )
}

@Directive({
  selector: 'span[ubBreadcrumbPage]',
  standalone: true,
  host: {
    'role': 'link',
    'aria-disabled': 'true',
    'aria-current': 'page',
    '[class]': 'computedClass()',
    'data-slot': 'breadcrumb-page',
  },
})
export class UbBreadcrumbPage {
  readonly class = input<string>()

  protected computedClass = computed(() =>
    cn('text-foreground font-normal', this.class()),
  )
}

@Component({
  selector: 'li[ubBreadcrumbSeparator]',
  standalone: true,
  imports: [NgxiLucide],
  template: `
    <span #ref><ng-content></ng-content></span>
    @if (ref.children.length == 0) {
      <svg [ngxiLucide]="lucideChevronRight"></svg>
    }
  `,
  host: {
    'role': 'presentation',
    'aria-hidden': 'true',
    '[class]': 'computedClass()',
    'data-slot': 'breadcrumb-separator',
  },
})
export class UbBreadcrumbSeparator {
  protected readonly lucideChevronRight = lucideChevronRight
  readonly class = input<string>()

  protected computedClass = computed(() =>
    cn('[&>svg]:size-3.5', this.class()),
  )
}

@Component({
  selector: 'span[ubBreadcrumbEllipsis]',
  standalone: true,
  imports: [NgxiLucide],
  template: `
    <svg [ngxiLucide]="lucideMoreHorizontal" class="size-4"></svg>
    <span class="sr-only">More</span>
  `,
  host: {
    'role': 'presentation',
    'aria-hidden': 'true',
    '[class]': 'computedClass()',
    'data-slot': 'breadcrumb-ellipsis',
  },
})
export class UbBreadcrumbEllipsis {
  protected readonly lucideMoreHorizontal = lucideMoreHorizontal
  readonly class = input<string>()

  protected computedClass = computed(() =>
    cn('flex size-9 items-center justify-center', this.class()),
  )
}
