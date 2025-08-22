import { booleanAttribute, Component, computed, Directive, input } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideCheck, lucideChevronRight, lucideCircle } from '@ng-icons/lucide'
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
import { cn } from '@/lib/utils'

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
    'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
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
    'relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
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
  },
})
export class UbDropdownMenuLabelDirective {
  class = input<string>()
  inset = input(false, {
    transform: booleanAttribute,
  })

  computedClass = computed(() => cn(
    'px-2 py-1.5 text-sm font-semibold',
    this.inset() && 'pl-8',
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
  computedClass = computed(() => cn('-mx-1 my-1 h-px bg-muted', this.class()))
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
  computedClass = computed(() => cn('ml-auto text-xs tracking-widest opacity-60', this.class()))
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
    '[class]': 'computedClass()',
  },
})
export class UbDropdownMenuSubContentDirective {
  class = input<string>()
  computedClass = computed(() => cn('z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2', this.class()))
}

@Component({
  standalone: true,
  selector: '[ubDropdownMenuSubTrigger]',
  imports: [NgIcon],
  providers: [provideIcons({ lucideChevronRight })],
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
  },
  template: `
  <ng-content />
  <ng-icon name="lucideChevronRight" class="ml-auto" />
  `,
})
export class UbDropdownMenuSubTrigger {
  class = input<string>()
  inset = input(false, {
    transform: booleanAttribute,
  })

  computedClass = computed(() => cn('flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0', this.inset() && 'pl-8', this.class()))
}

@Component({
  standalone: true,
  selector: '[ubDropdownMenuCheckboxItem]',
  imports: [NgIcon, RdxDropdownMenuItemIndicatorDirective],
  providers: [provideIcons({ lucideCheck })],
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
  <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
    <ng-icon name="lucideCheck" class="h-4 w-4" rdxDropdownMenuItemIndicator />
  </span>
  <ng-content></ng-content>
  `,
})
export class UbDropdownMenuCheckboxItemDirective {
  class = input<string>()
  computedClass = computed(() => cn('relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50', this.class()))
}

@Component({
  standalone: true,
  selector: '[ubDropdownMenuRadioItem]',
  imports: [NgIcon, RdxDropdownMenuItemIndicatorDirective],
  providers: [provideIcons({ lucideCircle })],
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
  <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
    <ng-icon name="lucideCircle" class="h-2 w-2 fill-current" rdxDropdownMenuItemIndicator />
  </span>
  <ng-content></ng-content>
  `,
})
export class UbDropdownMenuRadioItemDirective {
  class = input<string>()
  computedClass = computed(() => cn('relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50', this.class(),
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
