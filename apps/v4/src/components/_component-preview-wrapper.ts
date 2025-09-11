import type { OnDestroy, OnInit } from '@angular/core'
import { Component, input, viewChild, ViewContainerRef } from '@angular/core'

import { Index } from '@/registry/__index__'

@Component({
  selector: 'component-preview-wrapper',
  template: `
    <ng-container #container> </ng-container>`,
})
export class ComponentPreviewWrapper implements OnInit, OnDestroy {
  vcr = viewChild('container', { read: ViewContainerRef })
  name = input<string>()
  align = input<string>()

  async ngOnInit() {
    if (!this.name())
      return

    const component = await (Index as any)[this.name()!].component()
    this.vcr()?.createComponent(component)
    this.vcr()?.element.nativeElement.previousElementSibling.setAttribute('data-align', this.align())
    this.vcr()?.element.nativeElement.previousElementSibling.classList.add(...'preview flex h-[450px] w-full justify-center p-10 data-[align=center]:items-center data-[align=end]:items-end data-[align=start]:items-start'.split(' '))
  }

  ngOnDestroy(): void {
    this.vcr()?.clear()
  }
}
