import { computed, Directive, input } from '@angular/core'

import { RdxHoverCardContentDirective, RdxHoverCardRootDirective, RdxHoverCardTriggerDirective } from '@radix-ng/primitives/hover-card'

import { cn } from '~/lib/utils'

@Directive({
  standalone: true,
  selector: '[ubHoverCard]',
  host: {
    'data-slot': 'hover-card',
  },
  hostDirectives: [
    {
      directive: RdxHoverCardRootDirective,
      inputs: ['anchor', 'defaultOpen', 'open', 'openDelay', 'closeDelay', 'externalControl', 'cssAnimation', 'cssOpeningAnimation', 'cssClosingAnimation'],
    },
  ],
})
export class UbHoverCard { }

@Directive({
  standalone: true,
  selector: '[ubHoverCardTrigger]',
  host: {
    'data-slot': 'hover-card-trigger',
  },
  hostDirectives: [RdxHoverCardTriggerDirective],
})
export class UbHoverCardTrigger { }

@Directive({
  standalone: true,
  selector: '[ubHoverCardContent]',
  host: {
    '[class]': 'computedClass()',
    'data-slot': 'hover-card-content',
  },
  hostDirectives: [
    {
      directive: RdxHoverCardContentDirective,
      inputs: ['side', 'sideOffset', 'align', 'alignOffset', 'alternatePositionsDisabled', 'onOverlayEscapeKeyDownDisabled', 'onOverlayOutsideClickDisabled'],
      outputs: ['onOverlayEscapeKeyDown', 'onOverlayOutsideClick', 'onOpen', 'onClosed'],
    },
  ],
})
export class UbHoverCardContent {
  readonly class = input<string>()
  readonly computedClass = computed(() => cn('bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-64 origin-(--radix-hover-card-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden', this.class()))
}
