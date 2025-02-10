import { Component } from '@angular/core'

import { ComponentPreview } from '~/components/component-preview'
import { ComponentWrapper } from '~/components/component-wrapper'

@Component({
  selector: 'app-home',
  imports: [ComponentWrapper, ComponentPreview],
  template: `
  <div class="grid gap-4 p-4">
    @for (demo of demos; track demo.name) {
      <ComponentWrapper [name]="demo.name" [class]="demo.class">
        <PreviewDemo [componentName]="demo.componentName" />
      </ComponentWrapper>
    }
  </div>
  `,
})
export default class HomePage {
  protected readonly demos: {
    name: string
    componentName: string
    class?: string
  }[] = [
      {
        name: 'accordion',
        componentName: 'accordion-demo',
      },
      {
        name: 'alert',
        componentName: 'alert-demo',
      },
      {
        name: 'aspect-ratio',
        componentName: 'aspect-ratio-demo',
      },
      {
        name: 'avatar',
        componentName: 'avatar-demo',
      },
      {
        name: 'badge',
        componentName: 'badge-demo',
      },
      {
        name: 'breadcrumb',
        componentName: 'breadcrumb-demo',
      },
    ]
}
