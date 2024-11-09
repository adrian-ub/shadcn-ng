import { examples } from '@/__registry__/examples'
import { cn } from '@/lib/utils'
import { AsyncPipe, NgComponentOutlet } from '@angular/common'

import { Component, computed, input } from '@angular/core'

@Component({
  standalone: true,
  selector: 'component-preview',
  imports: [NgComponentOutlet, AsyncPipe],
  template: `
  @let componentRender = this.component() | async;
    <div [class]="computedClass()">
      @if(!componentRender || !componentRender.default) {
        <div>Loading...</div>
      } @else {
        <ng-container *ngComponentOutlet="componentRender.default"  />
      }
    </div>
    `,
})
export class ComponentPeviewComponent {
  styleName = input<string>()
  nameExample = input<string>()
  align = input<'center' | 'start' | 'end'>('center')

  computedClass = computed(() => cn('preview [&>div]:flex [&>div]:min-h-[350px] [&>div]:w-full [&>div]:justify-center [&>div]:p-10', {
    '[&>div]:items-center': this.align() === 'center',
    '[&>div]:items-start': this.align() === 'start',
    '[&>div]:items-end': this.align() === 'end',
  }))

  component = computed(async () => {
    if (!this.styleName() || !this.nameExample())
      return null

    return await examples[this.styleName()!][this.nameExample()!].component()
  })
}
