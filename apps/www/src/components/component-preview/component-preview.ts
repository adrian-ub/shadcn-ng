import type { Style } from '~/registry/registry-styles'
import { AsyncPipe, NgComponentOutlet } from '@angular/common'
import { Component, computed, input } from '@angular/core'
import { cn } from '~/lib/utils'

@Component({
  standalone: true,
  selector: 'component-preview',
  imports: [NgComponentOutlet, AsyncPipe],
  template: `
  @let componentRender = this.component() | async;

    <div [class]="computedClass()">
      @if(this.existComponent && (!componentRender || !componentRender?.default)) {
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
        <ng-container *ngComponentOutlet="componentRender!.default"  />
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

  component = computed(() => {
    if (!this.styleName() || !this.nameExample()) {
      return null
    }
    const registry = import.meta.glob<{ default: any }>(`../../registry/**/**/*.ts`)

    const componentPath = Object.keys(registry).find(key => key.includes(this.styleName()!) && key.includes(this.nameExample()!))

    const component = registry[componentPath!]()

    try {
      return component
    }
    catch {
      this.existComponent = false
      return null
    }
  })
}
