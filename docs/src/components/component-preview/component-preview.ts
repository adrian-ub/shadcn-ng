import { Index } from '@/__registry__'
import { cn } from '@/lib/utils'
import { AsyncPipe, NgComponentOutlet } from '@angular/common'
import { Component, computed, input } from '@angular/core'

import type { Style } from '@/registry/registry-styles'

@Component({
  standalone: true,
  selector: 'component-preview',
  imports: [NgComponentOutlet, AsyncPipe],
  template: `
  @let componentRender = this.component() | async;
    <div [class]="computedClass()">
      @if(this.existComponent && (!componentRender || !componentRender.default)) {
          <div>Loading...</div>
      }
      @else if (!this.existComponent) {
        <div>
          <p class="text-sm text-muted-foreground">
            Component <code class="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">{{nameExample()}}</code> not found in registry.
          </p>
        </div>
      }
      @else {
        <ng-container *ngComponentOutlet="componentRender.default"  />
      }
    </div>
    `,
})
export class ComponentPeviewComponent {
  styleName = input<Style['name']>()
  nameExample = input<string>()
  align = input<'center' | 'start' | 'end'>('center')
  existComponent = true

  computedClass = computed(() => cn('preview [&>div]:flex [&>div]:min-h-[350px] [&>div]:w-full [&>div]:justify-center [&>div]:p-10', {
    '[&>div]:items-center': this.align() === 'center',
    '[&>div]:items-start': this.align() === 'start',
    '[&>div]:items-end': this.align() === 'end',
  }))

  component = computed(async () => {
    if (!this.styleName() || !this.nameExample()) {
      return null
    }

    try {
      return await Index[this.styleName()!][this.nameExample()!].component()
    }
    catch {
      this.existComponent = false
      return null
    }
  })
}
