import { booleanAttribute, Component, computed, Directive, input, numberAttribute } from '@angular/core'

import { lucideCheck, lucideChevronRight, lucideCircle, NgxiLucide } from '@ngxi/lucide'
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
        'sideOffset: sideOffset',
        'alignOffset',
      ],
      outputs: ['onOpenChange'],
    },
  ],
  host: {
    'data-slot': 'dropdown-menu-trigger',
  },
})
export class UbDropdownMenuTrigger {
  sideOffset = input(4, {
    transform: numberAttribute,
  })
}

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
    'data-slot': 'dropdown-menu-content',
  },
})
export class UbDropdownMenuContent {
  class = input<string>()
  computedClass = computed(() => cn(
    'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md',
    this.class(),
  ))
}

@Directive({
  standalone: true,
  selector: '[ubDropdownMenuGroup]',
  hostDirectives: [RdxMenuGroupDirective],
})
export class UbDropdownMenuGroup { }

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
    'data-slot': 'dropdown-menu-item',
    '[attr.data-inset]': 'inset()',
    '[attr.data-variant]': 'variant()',
  },
})
export class UbDropdownMenuItem {
  readonly class = input<string>()
  readonly inset = input(false, {
    transform: booleanAttribute,
  })

  readonly variant = input<'default' | 'destructive'>('default')

  readonly computedClass = computed(() => cn(
    'focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*=\'text-\'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
    this.class(),
  ))
}

@Component({
  standalone: true,
  selector: '[ubDropdownMenuCheckboxItem]',
  imports: [NgxiLucide, RdxDropdownMenuItemIndicatorDirective],
  hostDirectives: [
    {
      directive: RdxDropdownMenuItemCheckboxDirective,
      inputs: ['checked', 'disabled'],
      outputs: ['checkedChange'],
    },
  ],
  host: {
    '[class]': 'computedClass()',
    'data-slot': 'dropdown-menu-checkbox-item',
  },
  template: `
  <span class="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
    <svg [ngxiLucide]="lucideCheck" class="size-4" rdxDropdownMenuItemIndicator></svg>
  </span>
  <ng-content></ng-content>
  `,
})
export class UbDropdownMenuCheckboxItem {
  protected readonly lucideCheck = lucideCheck
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
  host: {
    'data-slot': 'dropdown-menu-radio-group',
  },
})
export class UbDropdownMenuRadioGroup { }

@Component({
  standalone: true,
  selector: '[ubDropdownMenuRadioItem]',
  imports: [NgxiLucide, RdxDropdownMenuItemIndicatorDirective],
  hostDirectives: [
    {
      directive: RdxDropdownMenuItemRadioDirective,
      inputs: ['value'],
    },
  ],
  host: {
    '[class]': 'computedClass()',
    'data-slot': 'dropdown-menu-radio-item',
  },
  template: `
  <span class="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
    <svg [ngxiLucide]="lucideCircle" class="size-2 fill-current" rdxDropdownMenuItemIndicator></svg>
  </span>
  <ng-content></ng-content>
  `,
})
export class UbDropdownMenuRadioItem {
  protected readonly lucideCircle = lucideCircle
  readonly class = input<string>()
  readonly computedClass = computed(() => cn('focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4', this.class()))
}

@Directive({
  standalone: true,
  selector: '[ubDropdownMenuLabel]',
  hostDirectives: [RdxDropdownMenuLabelDirective],
  host: {
    '[class]': 'computedClass()',
    '[attr.data-inset]': 'inset()',
    'data-slot': 'dropdown-menu-label',
  },
})
export class UbDropdownMenuLabel {
  readonly class = input<string>()
  readonly inset = input(false, {
    transform: booleanAttribute,
  })

  readonly computedClass = computed(() => cn(
    'px-2 py-1.5 text-sm font-medium data-[inset]:pl-8',
    this.class(),
  ))
}

@Directive({
  standalone: true,
  selector: '[ubDropdownMenuSeparator]',
  hostDirectives: [RdxDropdownMenuSeparatorDirective],
  host: {
    '[class]': 'computedClass()',
    'data-slot': 'dropdown-menu-separator',
  },
})
export class UbDropdownMenu {
  readonly class = input<string>()
  readonly computedClass = computed(() => cn('bg-border -mx-1 my-1 h-px', this.class()))
}

@Directive({
  standalone: true,
  selector: 'span[ubDropdownMenuShortcut]',
  host: {
    '[class]': 'computedClass()',
    'data-slot': 'dropdown-menu-shortcut',
  },
})
export class UbDropdownMenuShortcut {
  readonly class = input<string>()
  readonly computedClass = computed(() => cn('text-muted-foreground ml-auto text-xs tracking-widest', this.class()))
}

@Component({
  standalone: true,
  selector: '[ubDropdownMenuSubTrigger]',
  imports: [NgxiLucide],
  hostDirectives: [
    UbDropdownMenuItem,
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
    'data-slot': 'dropdown-menu-sub-trigger',
  },
  template: `
  <ng-content />
  <svg [ngxiLucide]="lucideChevronRight" class="ml-auto size-4"></svg>
  `,
})
export class UbDropdownMenuSub {
  protected readonly lucideChevronRight = lucideChevronRight
  readonly class = input<string>()
  readonly inset = input(false, {
    transform: booleanAttribute,
  })

  computedClass = computed(() => cn('focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8', this.class()))
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
  host: {
    'data-slot': 'dropdown-menu-sub-content',
  },
})
export class UbDropdownMenuSubContent {
  readonly class = input<string>()
  computedClass = computed(() => cn(
    'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg',
    this.class(),
  ))
}
