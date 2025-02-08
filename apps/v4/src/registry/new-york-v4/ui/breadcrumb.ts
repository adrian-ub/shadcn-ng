import { Component, computed, Directive, input } from '@angular/core'

import { NgIconComponent, provideIcons } from '@ng-icons/core'
import { radixChevronRight, radixDotsHorizontal } from '@ng-icons/radix-icons'

import { cn } from '~/lib/utils'

@Directive({
  selector: 'nav[ubBreadcrumb]',
  standalone: true,
  host: {
    '[attr.aria-label]': '"breadcrumb"',
  },
})
export class UbBreadcrumbDirective {}

@Directive({
  selector: 'ol[ubBreadcrumbList]',
  standalone: true,
  host: {
    '[class]': 'computedClass()',
  },
})
export class UbBreadcrumbListDirective {
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
  },
})
export class UbBreadcrumbItemDirective {
  readonly class = input<string>()

  protected computedClass = computed(() =>
    cn('inline-flex items-center gap-1.5', this.class()),
  )
}

@Directive({
  selector: '[ubBreadcrumbLink], a[ubBreadcrumbLink]',
  standalone: true,
  host: {
    '[class]': 'computedClass()',
  },
})
export class UbBreadcrumbLinkDirective {
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
    '[attr.aria-disabled]': 'true',
    '[attr.aria-current]': '"page"',
    '[class]': 'computedClass()',
  },
})
export class UbBreadcrumbPageDirective {
  readonly class = input<string>()

  protected computedClass = computed(() =>
    cn('text-foreground font-normal', this.class()),
  )
}

@Component({
  selector: 'li[ubBreadcrumbSeparator]',
  standalone: true,
  imports: [NgIconComponent],
  viewProviders: [provideIcons({ radixChevronRight })],
  template: `
    <span #ref><ng-content></ng-content></span>
    @if (ref.children.length == 0) {
      <ng-icon name="radixChevronRight" />
    }
  `,
  host: {
    'role': 'presentation',
    '[attr.aria-hidden]': 'true',
    '[class]': 'computedClass()',
  },
})
export class UbBreadcrumbSeparatorComponent {
  readonly class = input<string>()

  protected computedClass = computed(() =>
    cn('[&>*>svg]:size-3.5', this.class()),
  )
}

@Component({
  selector: 'span[ubBreadcrumbEllipsis]',
  standalone: true,
  imports: [NgIconComponent],
  viewProviders: [provideIcons({ radixDotsHorizontal })],
  template: `
    <ng-icon name="radixDotsHorizontal" class="size-4" />
    <span class="sr-only">More</span>
  `,
  host: {
    'role': 'presentation',
    '[attr.aria-hidden]': 'true',
    '[class]': 'computedClass()',
  },
})
export class UbBreadcrumbEllipsisComponent {
  readonly class = input<string>()

  protected computedClass = computed(() =>
    cn('flex size-9 items-center justify-center', this.class()),
  )
}
