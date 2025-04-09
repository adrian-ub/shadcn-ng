import { Component, effect, signal } from '@angular/core'
import { LucideMoonIcon, LucideSunIcon } from '@ngxi/lucide'

import { UbButtonDirective } from '~/registry/new-york/ui/button'

type Theme = 'light' | 'dark'

@Component({
  selector: 'ModeSwitcher',
  imports: [UbButtonDirective, LucideMoonIcon, LucideSunIcon],
  template: `
  <button ubButton variant="ghost" class="group/toggle h-8 w-8 px-0" (click)="toggleTheme()">
    <svg lucideSunIcon class="hidden [html.dark_&]:block size-4 stroke-current"></svg>
    <svg lucideMoonIcon class="hidden [html.light_&]:block size-4 stroke-current"></svg>
    <span class="sr-only">Toggle theme</span>
  </button>
  `,
})
export class ModeSwitcher {
  private _theme = signal(this.getInitialTheme())

  constructor() {
    effect(() => {
      const theme = this._theme()
      const root = document.documentElement

      if (theme === 'dark') {
        root.classList.add('dark')
        root.classList.remove('light')
      }
      else {
        root.classList.remove('dark')
        root.classList.add('light')
      }

      localStorage.setItem('theme', theme)
    })
  }

  private getInitialTheme(): Theme {
    const stored = localStorage.getItem('theme') as Theme | null
    if (stored)
      return stored

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    return prefersDark ? 'dark' : 'light'
  }

  toggleTheme(): void {
    this._theme.update(t => (t === 'dark' ? 'light' : 'dark'))
  }
}
