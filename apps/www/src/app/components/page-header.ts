import { Component, computed, Directive, input } from '@angular/core'

import { cn } from '~/lib/utils'

@Component({
  selector: 'section[pageHeader]',
  host: {
    '[class]': 'computedClass()',
  },
  template: `
    <div class="container-wrapper">
      <div class="container flex flex-col items-start gap-1 py-8 md:py-10 lg:py-12">
        <ng-content />
      </div>
    </div>
    `,
})
export class PageHeader {
  class = input('')
  protected computedClass = computed(() => cn('border-grid border-b', this.class))
}

@Directive({
  selector: 'h1[pageHeaderHeading]',
  host: {
    '[class]': 'computedClass()',
  },
})
export class PageHeaderHeading {
  class = input('')
  protected computedClass = computed(() => cn('text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]', this.class()))
}

@Directive({
  selector: 'p[pageHeaderDescription]',
  host: {
    '[class]': 'computedClass()',
  },
})
export class PageHeaderDescription {
  class = input('')
  protected computedClass = computed(() => cn('max-w-2xl text-balance text-lg font-light text-foreground', this.class()))
}

@Directive({
  selector: 'div[pageActions]',
  host: {
    '[class]': 'computedClass()',
  },
})
export class PageActions {
  class = input('')
  protected computedClass = computed(() => cn('flex w-full items-center justify-start gap-2 pt-2', this.class()))
}
