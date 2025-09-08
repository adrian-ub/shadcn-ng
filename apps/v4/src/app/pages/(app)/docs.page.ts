import { Component } from '@angular/core'
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'
import { sidebarData } from '@/data/sidebar'

@Component({
  selector: 'app-docs-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
  <div class="container-wrapper flex flex-1 flex-col px-2">
    <div data-slot="sidebar-wrapper" class="group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex w-full 3xl:fixed:container 3xl:fixed:px-3 min-h-min flex-1 items-start px-0 [--sidebar-width:220px] [--top-spacing:0] lg:grid lg:grid-cols-[var(--sidebar-width)_minmax(0,1fr)] lg:[--sidebar-width:240px] lg:[--top-spacing:calc(var(--spacing)*4)]" style="--sidebar-width: 16rem; --sidebar-width-icon: 3rem;">
      <div data-slot="sidebar" class="text-sidebar-foreground w-(--sidebar-width) flex-col sticky top-[calc(var(--header-height)+1px)] z-30 hidden h-[calc(100svh-var(--footer-height)+2rem)] bg-transparent lg:flex">
        <div data-slot="sidebar-content" data-sidebar="content" class="flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden no-scrollbar overflow-x-hidden px-2 pb-12">
          <div class="h-(--top-spacing) shrink-0"></div>

          @for (sidebarGroup of sidebarData; track $index) {
            <div data-slot="sidebar-group" data-sidebar="group" class="relative flex w-full min-w-0 flex-col p-2">
              <div data-slot="sidebar-group-label" data-sidebar="group-label" class="ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0 group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 text-muted-foreground font-medium">
                {{sidebarGroup.label}}
              </div>
              <div data-slot="sidebar-group-content" data-sidebar="group-content" class="w-full text-sm">
                <ul data-slot="sidebar-menu" data-sidebar="menu" class="flex w-full min-w-0 flex-col gap-1">
                  @for (item of sidebarGroup.items; track $index) {
                    <li data-slot="sidebar-menu-item" data-sidebar="menu-item" class="group/menu-item relative">
                      <a [routerLink]="item.link" routerLinkActive #rla="routerLinkActive" [routerLinkActiveOptions]="{exact: true}"
                      [attr.data-active]="rla.isActive" data-slot="sidebar-menu-button" class="peer/menu-button flex items-center gap-2 rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-accent data-[active=true]:border-accent 3xl:fixed:w-full 3xl:fixed:max-w-48 relative h-[30px] w-fit overflow-visible border border-transparent text-[0.8rem] font-medium after:absolute after:inset-x-0 after:-inset-y-1 after:z-0 after:rounded-md">{{item.label}}</a>
                    </li>
                  }
                </ul>
              </div>
            </div>
          }

        </div>
      </div>
      <div class="h-full w-full">
        <router-outlet />
      </div>
    </div>
  </div>
  `,
})
export default class DocsPage {
  protected readonly sidebarData = sidebarData
}
