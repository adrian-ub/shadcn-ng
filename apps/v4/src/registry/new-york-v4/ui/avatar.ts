import { computed, Directive, input } from '@angular/core'
import { RdxAvatarFallbackDirective, RdxAvatarImageDirective, RdxAvatarRootDirective } from '@radix-ng/primitives/avatar'

import { cn } from '~/lib/utils'

@Directive({
  standalone: true,
  selector: 'span[ubAvatar]',
  hostDirectives: [RdxAvatarRootDirective],
  host: {
    '[class]': 'computedClass()',
  },
})
export class UbAvatarDirective {
  readonly class = input<string>()

  readonly computedClass = computed(() => {
    return cn('relative flex size-8 shrink-0 overflow-hidden rounded-full', this.class())
  })
}

@Directive({
  standalone: true,
  selector: 'img[ubAvatarImage]',
  hostDirectives: [RdxAvatarImageDirective],
  host: {
    '[class]': 'computedClass()',
  },
})
export class UbAvatarImageDirective {
  readonly class = input<string>()

  readonly computedClass = computed(() => {
    return cn('aspect-square size-full', this.class())
  })
}

@Directive({
  standalone: true,
  selector: 'span[ubAvatarFallback]',
  hostDirectives: [RdxAvatarFallbackDirective],
  host: {
    '[class]': 'computedClass()',
  },
})
export class UbAvatarFallbackDirective {
  readonly class = input<string>()

  readonly computedClass = computed(() => {
    return cn('bg-muted flex size-full items-center justify-center rounded-full', this.class())
  })
}
