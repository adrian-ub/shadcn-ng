import type { OnInit } from '@angular/core'
import { Component, input, viewChild, ViewContainerRef } from '@angular/core'

@Component({
  selector: 'PreviewDemo',
  template: `
   <ng-container #container></ng-container>
   `,
})
export class ComponentPreview implements OnInit {
  private readonly container = viewChild.required('container', { read: ViewContainerRef })
  componentName = input.required<string>()

  async ngOnInit(): Promise<void> {
    const { default: ComponentDemo } = await import(`./${this.componentName()}.ts`)

    if (!ComponentDemo) {
      return
    }

    this.container().createComponent(ComponentDemo)
  }
}
