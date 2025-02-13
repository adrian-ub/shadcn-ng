import { Component, computed, input } from '@angular/core'
import { cn } from '~/lib/utils'

@Component({
  selector: 'ComponentWrapper',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-name]': 'name().toLowerCase()',
  },
  template: `
  <div class="border-b px-4 py-3">
    <div class="text-sm font-medium">{{componentName()}}</div>
  </div>
  <div class="flex flex-1 items-center gap-2 p-4">
    <ng-content />
  </div>
  `,
})
export class ComponentWrapper {
  name = input.required<string>()
  class = input<string>()
  computedClass = computed(() => cn('flex w-full scroll-mt-16 flex-col rounded-lg border', this.class()))
  componentName = computed(() => this.name().replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase()))
}
