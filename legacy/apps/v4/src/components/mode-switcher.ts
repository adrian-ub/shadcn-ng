import { Component, computed, effect, signal } from '@angular/core'

import { UbButtonDirective } from '~/registry/new-york-v4/ui/button'

@Component({
  selector: 'ModeSwitcher',
  imports: [UbButtonDirective],
  template: `
    <button ubButton variant="ghost" class="group/toggle h-8 w-8 px-0" (click)="toggleTheme()">
      <!-- SunIcon -->
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="hidden [html.dark_&]:block">
        <circle cx="12" cy="12" r="4"></circle>
        <path d="M12 2v2"></path>
        <path d="M12 20v2"></path>
        <path d="m4.93 4.93 1.41 1.41"></path>
        <path d="m17.66 17.66 1.41 1.41"></path>
        <path d="M2 12h2"></path>
        <path d="M20 12h2"></path>
        <path d="m6.34 17.66-1.41 1.41"></path>
        <path d="m19.07 4.93-1.41 1.41"></path>
      </svg>

      <!-- MoonIcon -->
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="hidden [html.light_&]:block">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
      </svg>

      <span class="sr-only">Toggle theme</span>
    </button>
    `,
})
export class ModeSwitcher {
  readonly theme = signal<'light' | 'dark'>(this.getInitialTheme())

  readonly isLightTheme = computed(() => this.theme() === 'light')

  constructor() {
    if (this.isBrowser()) {
      effect(() => {
        const currentTheme = this.theme()
        localStorage.setItem('theme', currentTheme)

        if (currentTheme === 'dark') {
          document.documentElement.classList.add('dark')
          document.documentElement.classList.remove('light')
        }
        else {
          document.documentElement.classList.remove('dark')
          document.documentElement.classList.add('light')
        }
      })
    }
  }

  toggleTheme(): void {
    if (this.isBrowser()) {
      this.theme.set(this.theme() === 'dark' ? 'light' : 'dark')
    }
  }

  private getInitialTheme(): 'light' | 'dark' {
    if (this.isBrowser()) {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme
      }

      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }

    return 'light'
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined'
  }
}
