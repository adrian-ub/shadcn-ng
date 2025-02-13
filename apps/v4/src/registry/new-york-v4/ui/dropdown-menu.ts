import { booleanAttribute, Component, computed, Directive, input } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { radixCheck, radixChevronRight, radixCircle } from '@ng-icons/radix-icons'
import {
  DropdownAlign,
  DropdownSide,
  RdxDropdownMenuContentDirective,
  RdxDropdownMenuItemCheckboxDirective,
  RdxDropdownMenuItemDirective,
  RdxDropdownMenuItemIndicatorDirective,
  RdxDropdownMenuItemRadioDirective,
  RdxDropdownMenuItemRadioGroupDirective,
  RdxDropdownMenuLabelDirective,
  RdxDropdownMenuSeparatorDirective,
  RdxDropdownMenuTriggerDirective,
} from '@radix-ng/primitives/dropdown-menu'
import { RdxMenuGroupDirective } from '@radix-ng/primitives/menu'
import { cn } from '~/lib/utils'

export { DropdownAlign, DropdownSide }

@Directive({
  standalone: true,
  selector: '[ubDropdownMenuTrigger]',
  hostDirectives: [
    {
      directive: RdxDropdownMenuTriggerDirective,
      inputs: [
        'rdxDropdownMenuTrigger: ubDropdownMenuTrigger',
        'disabled',
        'side',
        'align',
        'sideOffset',
        'alignOffset',
      ],
      outputs: ['onOpenChange'],
    },
  ],
})
export class UbDropdownMenuTriggerDirective { }

@Directive({
  standalone: true,
  selector: '[ubDropdownMenuContent]',
  hostDirectives: [
    {
      directive: RdxDropdownMenuContentDirective,
      inputs: ['closeOnEscape', 'onEscapeKeyDown'],
    },
  ],
  host: {
    '[class]': 'computedClass()',
  },
})
export class UbDropdownMenuContentDirective {
  class = input<string>()
  computedClass = computed(() => cn(
    'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-md',
    this.class(),
  ))
}

@Directive({
  standalone: true,
  selector: '[ubDropdownMenuItem]',
  hostDirectives: [
    {
      directive: RdxDropdownMenuItemDirective,
      inputs: ['disabled'],
      outputs: ['onSelect'],
    },
  ],
  host: {
    '[class]': 'computedClass()',
  },
})
export class UbDropdownMenuItemDirective {
  class = input<string>()
  inset = input(false, {
    transform: booleanAttribute,
  })

  computedClass = computed(() => cn(
    'focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*=\'text-\'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
    this.inset() && 'pl-8',
    this.class(),
  ))
}

@Directive({
  standalone: true,
  selector: '[ubDropdownMenuLabel]',
  hostDirectives: [RdxDropdownMenuLabelDirective],
  host: {
    '[class]': 'computedClass()',
    '[attr.data-inset]': 'inset()',
  },
})
export class UbDropdownMenuLabelDirective {
  class = input<string>()
  inset = input(false, {
    transform: booleanAttribute,
  })

  computedClass = computed(() => cn(
    'px-2 py-1.5 text-sm font-semibold data-[inset]:pl-8',
    this.class(),
  ))
}

@Directive({
  standalone: true,
  selector: '[ubDropdownMenuSeparator]',
  hostDirectives: [RdxDropdownMenuSeparatorDirective],
  host: {
    '[class]': 'computedClass()',
  },
})
export class UbDropdownMenuSeparator {
  class = input<string>()
  computedClass = computed(() => cn('bg-border -mx-1 my-1 h-px', this.class()))
}

@Directive({
  standalone: true,
  selector: '[ubDropdownMenuGroup]',
  hostDirectives: [RdxMenuGroupDirective],
})
export class UbDropdownMenuGroupDirective { }

@Directive({
  standalone: true,
  selector: 'span[ubDropdownMenuShortcut]',
  host: {
    '[class]': 'computedClass()',
  },
})
export class UbDropdownMenuShortcutDirective {
  class = input<string>()
  computedClass = computed(() => cn('text-muted-foreground ml-auto text-xs tracking-widest', this.class()))
}

@Directive({
  standalone: true,
  selector: '[ubDropdownMenuSubContent]',
  hostDirectives: [
    {
      directive: RdxDropdownMenuContentDirective,
      inputs: ['closeOnEscape', 'onEscapeKeyDown'],
    },
  ],
})
export class UbDropdownMenuSubContentDirective {}

@Component({
  standalone: true,
  selector: '[ubDropdownMenuSubTrigger]',
  imports: [NgIcon],
  providers: [provideIcons({ radixChevronRight })],
  hostDirectives: [
    UbDropdownMenuItemDirective,
    {
      directive: RdxDropdownMenuTriggerDirective,
      inputs: [
        'rdxDropdownMenuTrigger: ubDropdownMenuSubTrigger',
        'disabled',
        'side',
        'align',
        'sideOffset',
        'alignOffset',
      ],
      outputs: ['onOpenChange'],
    },
  ],
  host: {
    '[class]': 'computedClass()',
    '[attr.data-inset]': 'inset()',
  },
  template: `
  <ng-content />
  <ng-icon name="radixChevronRight" class="ml-auto" />
  `,
})
export class UbDropdownMenuSubTrigger {
  class = input<string>()
  inset = input(false, {
    transform: booleanAttribute,
  })

  computedClass = computed(() => cn('focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8', this.class()))
}

@Component({
  standalone: true,
  selector: '[ubDropdownMenuCheckboxItem]',
  imports: [NgIcon, RdxDropdownMenuItemIndicatorDirective],
  providers: [provideIcons({ radixCheck })],
  hostDirectives: [
    {
      directive: RdxDropdownMenuItemCheckboxDirective,
      inputs: ['checked', 'disabled'],
      outputs: ['checkedChange'],
    },
  ],
  host: {
    '[class]': 'computedClass()',
  },
  template: `
  <span class="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
    <ng-icon name="radixCheck" class="size-4" rdxDropdownMenuItemIndicator />
  </span>
  <ng-content></ng-content>
  `,
})
export class UbDropdownMenuCheckboxItemDirective {
  class = input<string>()
  computedClass = computed(() => cn('focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4', this.class(),
  ))
}

@Component({
  standalone: true,
  selector: '[ubDropdownMenuRadioItem]',
  imports: [NgIcon, RdxDropdownMenuItemIndicatorDirective],
  providers: [provideIcons({ radixCircle })],
  hostDirectives: [
    {
      directive: RdxDropdownMenuItemRadioDirective,
      inputs: ['value'],
    },
  ],
  host: {
    '[class]': 'computedClass()',
  },
  template: `
  <span class="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
    <ng-icon name="radixCircle" class="size-2 fill-current" rdxDropdownMenuItemIndicator />
  </span>
  <ng-content></ng-content>
  `,
})
export class UbDropdownMenuRadioItemDirective {
  class = input<string>()
  computedClass = computed(() => cn('focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4', this.class(),
  ))
}

@Directive({
  standalone: true,
  selector: '[ubDropdownMenuRadioGroup]',
  hostDirectives: [
    {
      directive: RdxDropdownMenuItemRadioGroupDirective,
      inputs: ['value'],
      outputs: ['valueChange'],
    },
  ],
})
export class UbDropdownMenuRadioGroupDirective { }
