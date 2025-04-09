import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
  <div class="relative flex min-h-svh flex-col bg-background">
    <router-outlet />
  </div>
  `,
})
export class AppComponent { }
