import { isPlatformBrowser } from '@angular/common'
import { Component, inject, PLATFORM_ID, signal } from '@angular/core'
import { UbButton } from '@/registry/new-york-v4/ui/button'

const localStorageKey = 'theme'
type Theme = 'light' | 'dark'

@Component({
  selector: 'mode-switcher',
  imports: [UbButton],
  template: `
  <button ubButton variant="ghost" size="icon" class="group/toggle extend-touch-target size-8" title="Toggle theme" (click)="toggleTheme()">
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4.5">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
        <path d="M12 3l0 18"></path>
        <path d="M12 9l4.65 -4.65"></path>
        <path d="M12 14.3l7.37 -7.37"></path>
        <path d="M12 19.6l8.85 -8.85"></path>
      </svg>
      <span class="sr-only">Toggle theme</span>
  </button>
  `,
})
export class ModeSwitcher {
  private readonly platform = inject(PLATFORM_ID)
  protected readonly theme = signal<Theme>('dark')
  constructor() {
    if (isPlatformBrowser(this.platform)) {
      const savedTheme = localStorage.getItem(localStorageKey) as Theme | null
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      this.setTheme(savedTheme ?? (prefersDark ? 'dark' : 'light'))
    }
  }

  protected setTheme(theme: Theme) {
    this.theme.set(theme)
    localStorage.setItem(localStorageKey, theme)
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.style.colorScheme = theme
  }

  protected toggleTheme(): void {
    this.setTheme(this.theme() === 'light' ? 'dark' : 'light')
  }
}
