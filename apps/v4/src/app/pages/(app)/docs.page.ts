import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'app-docs-layout',
  imports: [RouterOutlet],
  template: `
  <div class="container-wrapper flex flex-1 flex-col px-2"><router-outlet /></div>
  `,
})
export default class DocsPage {}
