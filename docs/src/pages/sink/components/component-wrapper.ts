import { Component, computed, input } from '@angular/core'
import { cn } from '~/registry/new-york-v4/lib/utils'

@Component({
  standalone: true,
  selector: 'ComponentWrapper',
  template: `
  @defer {
    <div [attr.data-name]="name().toLowerCase()" [class]="computedClass()">
      <div class="border-b px-4 py-3">
        <div class="text-sm font-medium">{{getComponentName()}}</div>
      </div>
      <div class="flex flex-1 items-center gap-2 p-4">
        <ng-content />
      </div>
    </div>
  } @error {
    <div class="p-4 text-red-500">
      Something went wrong in component: {{this.name()}}
    </div>
  }
  `,
})
export class ComponentWrapper {
  name = input.required<string>()
  class = input<string>()
  computedClass = computed(() => cn('flex w-full scroll-mt-16 flex-col rounded-lg border', this.class()))

  getComponentName = computed(() => this.name().replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase()))
}
