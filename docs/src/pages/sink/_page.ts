import { Component } from '@angular/core'

import { sinkComponents } from './components'

@Component({
  standalone: true,
  selector: 'SinkPage',
  imports: [...sinkComponents],
  template: `
  <header class="bg-background sticky top-0 z-10 flex h-14 items-center border-b p-4"></header>
  <div class="@container grid flex-1 gap-4 p-4">
    <ComponentWrapper name="accordion">
      <AccordionDemo />
    </ComponentWrapper>
    <ComponentWrapper name="alert">
      <AlertDemo />
    </ComponentWrapper>
  </div>
`,
})
export class SinkPage { }
