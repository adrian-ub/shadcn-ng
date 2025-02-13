import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

import { ModeSwitcher } from '~/components/mode-switcher'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ModeSwitcher],
  template: `
    <div class="group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar min-h-svh w-full flex flex-col pt-(--header-height) [--header-height:calc(--spacing(14))]">
      <header class="bg-background fixed inset-x-0 top-0 isolate z-10 flex shrink-0 items-center gap-2 border-b">
        <div class="flex h-(--header-height) w-full items-center gap-2 px-4">
          <nav class="group/navigation-menu relative flex max-w-max flex-1 items-center justify-center">
            <div style="position:relative">
              <ul class="group flex flex-1 list-none items-center justify-center gap-2 *:data-[slot=navigation-menu-item]:h-7 **:data-[slot=navigation-menu-link]:py-1 **:data-[slot=navigation-menu-link]:font-medium">
                <li class="relative" data-slot="navigation-menu-item">
                  <a class="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 [&_svg:not([class*='text-'])]:text-muted-foreground flex flex-col gap-1 rounded-sm p-2 text-sm transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4" data-slot="navigation-menu-link" data-active="true">Home</a>
                </li>
              </ul>
            </div>
          </nav>

          <div class="ml-auto flex items-center gap-2">
            <ModeSwitcher />
          </div>
        </div>
      </header>

      <div class="flex flex-1">
        <main class="bg-background relative flex min-h-svh flex-1 flex-col peer-data-[variant=inset]:min-h-[calc(100svh-(--spacing(4)))] md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2">
          <div class="grid gap-4 p-4">
            <router-outlet />
          </div>
        </main>
      </div>
  </div>
  `,
  styles: [],
})
export class AppComponent {
  title = 'v4'
}
