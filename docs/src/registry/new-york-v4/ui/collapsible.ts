import { Directive } from '@angular/core'

import {
  RdxCollapsibleContentDirective,
  RdxCollapsibleRootDirective,
  RdxCollapsibleTriggerDirective,
} from '@radix-ng/primitives/collapsible'

@Directive({
  standalone: true,
  selector: '[ubCollapsible]',
  exportAs: 'ubCollapsible',
  hostDirectives: [
    {
      directive: RdxCollapsibleRootDirective,
      inputs: ['open', 'disabled'],
      outputs: ['onOpenChange'],
    },
  ],
  host: {
    'data-slot': 'collapsible',
  },
})
export class UbCollapsible { }

@Directive({
  standalone: true,
  selector: '[ubCollapsibleTrigger]',
  hostDirectives: [RdxCollapsibleTriggerDirective],
  host: {
    'data-slot': 'collapsible-trigger',
  },
})
export class UbCollapsibleTrigger { }

@Directive({
  standalone: true,
  selector: '[ubCollapsibleContent]',
  hostDirectives: [RdxCollapsibleContentDirective],
  host: {
    'data-slot': 'collapsible-content',
  },
})
export class UbCollapsibleContent { }
