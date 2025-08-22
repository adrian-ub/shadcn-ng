import { Component, signal } from '@angular/core'
import { RouterOutlet } from '@angular/router'

import { UbButtonDirective } from '@/registry/new-york/ui/button'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UbButtonDirective],
  template: `
    <h1>Welcome to {{ title() }}!</h1>
    <button ubButton>Click me</button>

    <router-outlet />
  `,
  styles: [],
})
export class App {
  protected readonly title = signal('v3')
}
