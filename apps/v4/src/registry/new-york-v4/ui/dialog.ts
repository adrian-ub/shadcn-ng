import type { TemplateRef } from '@angular/core'
import type { RdxDialogConfig } from '@radix-ng/primitives/dialog'
import { Component, computed, Directive, effect, inject, input } from '@angular/core'
import { NgIconComponent, provideIcons } from '@ng-icons/core'
import { lucideX } from '@ng-icons/lucide'

import {
  RdxDialogCloseDirective,
  RdxDialogContentDirective,
  RdxDialogDescriptionDirective,
  RdxDialogTitleDirective,
  RdxDialogTriggerDirective,
} from '@radix-ng/primitives/dialog'
import { cn } from '~/lib/utils'

@Directive({
  standalone: true,
  selector: 'button[ubDialogClose]',
  hostDirectives: [RdxDialogCloseDirective],
})
export class UbDialogCloseDirective {}

@Directive({
  standalone: true,
  selector: '[ubDialogTrigger]',
  hostDirectives: [
    {
      directive: RdxDialogTriggerDirective,
      inputs: ['rdxDialogTrigger: ubDialogTrigger'],
    },
  ],
})
export class UbDialogTriggerDirective {
  rdxDialogTrigger = inject(RdxDialogTriggerDirective, { host: true })
  ubDialogTrigger = input.required<TemplateRef<void>>()
  ubDialogConfig = input<RdxDialogConfig<unknown>>()

  passingConfig = effect(() => {
    this.rdxDialogTrigger.dialogConfig = {
      ...this.ubDialogConfig(),
      content: this.ubDialogTrigger(),
      backdropClass: ['data-[state=open]:animate-in', 'data-[state=closed]:animate-out', 'data-[state=closed]:fade-out-0', 'data-[state=open]:fade-in-0', 'fixed', 'inset-0', 'z-50', 'bg-black/80'],
    }
  })
}

@Component({
  standalone: true,
  selector: '[ubDialogContent]',
  imports: [RdxDialogCloseDirective, NgIconComponent],
  host: {
    '[class]': 'computedClass()',
  },
  hostDirectives: [
    {
      directive: RdxDialogContentDirective,
    },
  ],
  viewProviders: [provideIcons({ lucideX })],
  template: `
  <ng-content />

  <button class="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4" rdxDialogClose>
    <ng-icon name="lucideX" />
    <span class="sr-only">Close</span>
  </button>
  `,
})
export class UbDialogContentDirective {
  class = input<string>()
  computedClass = computed(() => cn('bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg', this.class()))
}

@Directive({
  standalone: true,
  selector: 'div[ubDialogHeader]',
  host: {
    '[class]': 'computedClass()',
  },
})
export class UbDialogHeaderDirective {
  class = input<string>()
  computedClass = computed(() => cn('flex flex-col gap-2 text-center sm:text-left', this.class()))
}

@Directive({
  standalone: true,
  selector: 'div[ubDialogFooter]',
  host: {
    '[class]': 'computedClass()',
  },
})
export class UbDialogFooterDirective {
  class = input<string>()
  computedClass = computed(() => cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', this.class()))
}

@Directive({
  standalone: true,
  selector: 'h2[ubDialogTitle]',
  host: {
    '[class]': 'computedClass()',
  },
  hostDirectives: [RdxDialogTitleDirective],
})
export class UbDialogTitleDirective {
  class = input<string>()
  computedClass = computed(() => cn('text-lg leading-none font-semibold', this.class()))
}

@Directive({
  standalone: true,
  selector: 'p[ubDialogDescription]',
  host: {
    '[class]': 'computedClass()',
  },
  hostDirectives: [RdxDialogDescriptionDirective],
})
export class UbDialogDescriptionDirective {
  class = input<string>()
  computedClass = computed(() => cn('text-muted-foreground text-sm', this.class()))
}
