import type { OnDestroy, OnInit } from '@angular/core'
import { Component, input, viewChild, ViewContainerRef } from '@angular/core'

import { Index } from '@/registry/__index__'

@Component({
  template: `<ng-container #container> </ng-container>`,
})
export class ComponentPreviewWrapper implements OnInit, OnDestroy {
  vcr = viewChild('container', { read: ViewContainerRef })
  name = input<string>()

  async ngOnInit() {
    if (!this.name())
      return

    const component = await (Index as any)[this.name()!].component()
    this.vcr()?.createComponent(component)
  }

  ngOnDestroy(): void {
    this.vcr()?.clear()
  }
}
