import { computed, Directive, input } from '@angular/core'

import { RdxAvatarImageDirective, RdxAvatarRootDirective } from '@radix-ng/primitives/avatar'

import { cn } from '@/lib/utils'

@Directive({
  standalone: true,
  selector: 'span[ubAvatar],ub-avatar',
  host: {
    'data-slot': 'avatar',
    '[class]': 'computedClass()',
  },
  hostDirectives: [RdxAvatarRootDirective],
})
export class UbAvatar {
  readonly class = input<string>()
  protected readonly computedClass = computed(() => cn('relative flex size-8 shrink-0 overflow-hidden rounded-full', this.class()))
}

@Directive({
  standalone: true,
  selector: 'img[ubAvatarImage]',
  host: {
    'data-slot': 'avatar-image',
    '[class]': 'computedClass()',
  },
  hostDirectives: [
    {
      directive: RdxAvatarImageDirective,
      inputs: ['src', 'referrerPolicy'],
      outputs: ['onLoadingStatusChange'],
    },
  ],
})
export class UbAvatarImage {
  readonly class = input<string>()
  protected readonly computedClass = computed(() => cn('aspect-square size-full', this.class()))
}

@Directive({
  standalone: true,
  selector: 'span[ubAvatarFallback], ub-avatar-fallback',
  host: {
    'data-slot': 'avatar-fallback',
    '[class]': 'computedClass()',
  },
})
export class UbAvatarFallback {
  readonly class = input<string>()
  protected readonly computedClass = computed(() => cn('bg-muted flex size-full items-center justify-center rounded-full', this.class()))
}
