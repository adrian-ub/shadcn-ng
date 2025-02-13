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
      inputs: ['open: open', 'disabled: disabled'],
      outputs: ['onOpenChange: onOpenChange'],
    },
  ],
})
export class UbCollapsible { }

@Directive({
  standalone: true,
  selector: '[ubCollapsibleTrigger]',
  hostDirectives: [RdxCollapsibleTriggerDirective],
})
export class UbCollapsibleTrigger { }

@Directive({
  standalone: true,
  selector: '[ubCollapsibleContent]',
  hostDirectives: [RdxCollapsibleContentDirective],
})
export class UbCollapsibleContent { }
