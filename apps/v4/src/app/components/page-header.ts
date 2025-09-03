import { Component, computed, Directive, input } from '@angular/core'
import { cn } from '@/lib/utils'

@Component({
  selector: 'page-header',
  host: {
    '[class]': 'computedClass()',
  },
  template: `
    <div class="container-wrapper">
      <div class="container flex flex-col items-center gap-2 py-8 text-center md:py-16 lg:py-20 xl:gap-4">
        <ng-content />
      </div>
    </div>
  `,
})
export class PageHeader {
  readonly class = input('')
  protected readonly computedClass = computed(() => cn('border-grid', this.class()))
}

@Directive({
  selector: 'h1[pageHeaderHeading]',
  host: {
    '[class]': 'computedClass()',
  },
})
export class PageHeaderHeading {
  readonly class = input('')
  protected readonly computedClass = computed(() => cn('text-primary leading-tighter max-w-2xl text-4xl font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-5xl xl:tracking-tighter', this.class()))
}

@Directive({
  selector: 'p[pageHeaderDescription]',
  host: {
    '[class]': 'computedClass()',
  },
})
export class PageHeaderDescription {
  readonly class = input('')
  protected readonly computedClass = computed(() => cn('text-foreground max-w-3xl text-base text-balance sm:text-lg', this.class()))
}

@Directive({
  selector: 'div[pageHeaderActions]',
  host: {
    '[class]': 'computedClass()',
  },
})
export class PageHeaderActions {
  readonly class = input('')
  protected readonly computedClass = computed(() => cn('flex w-full items-center justify-center gap-2 pt-2 **:data-[slot=button]:shadow-none', this.class()))
}
