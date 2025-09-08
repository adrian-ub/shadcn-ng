import type { RouteMeta } from '@analogjs/router'
import { Component } from '@angular/core'

export const routeMeta: RouteMeta = {
  title: 'Kitchen Sink',
  meta: [
    {
      name: 'description',
      content: 'A page with all components for testing purposes.',
    },
  ],
}

@Component({
  selector: 'app-sink',
  template: `
  <main class="bg-background">
    <header class="bg-background sticky top-0 z-10 flex h-14 items-center border-b p-4">
      <h1 class="text-base font-medium">Kitchen Sink</h1>
    </header>
    <div class="@container grid flex-1 gap-4 p-4">
    </div>
  </main>
  `,
})
export default class SinkPage { }
