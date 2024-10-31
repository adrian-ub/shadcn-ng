import { Component } from '@angular/core'

@Component({
  standalone: true,
  selector: 'typography-h2-default',
  template: `
    <h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
      The People of the Kingdom
    </h2>
  `,
})
export default class TypographyH2Default { }
