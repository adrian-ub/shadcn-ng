import { isPlatformBrowser } from '@angular/common'
import { Component, computed, inject, input, PLATFORM_ID, signal } from '@angular/core'
import { cn } from '@/lib/utils'
import { UbButton } from '@/registry/new-york-v4/ui/button'

const localStorageKey = 'layout'
type Layout = 'full' | 'fixed'

@Component({
  selector: 'site-config',
  imports: [UbButton],
  template: `
  <button ubButton variant="ghost" size="icon" [class]="computedClass()" (click)="toggleLayout()">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-gallery-horizontal" class="size-4">
      <path d="M2 3v18"></path>
      <rect width="12" height="18" x="6" y="3" rx="2"></rect>
      <path d="M22 3v18"></path>
    </svg>
  </button>
  `,
})
export class SiteConfig {
  readonly class = input<string>()
  protected readonly computedClass = computed(() => cn('size-8', this.class()))
  private readonly platform = inject(PLATFORM_ID)
  protected readonly theme = signal<Layout>('full')
  constructor() {
    if (isPlatformBrowser(this.platform)) {
      const layout = localStorage.getItem(localStorageKey) as Layout
      this.theme.set(layout ?? 'full')
    }
  }

  protected setLayout(layout: Layout) {
    this.theme.set(layout)
    localStorage.setItem(localStorageKey, layout)
    document.documentElement.classList.toggle('layout-full', layout === 'full')
    document.documentElement.classList.toggle('layout-fixed', layout === 'fixed')
  }

  protected toggleLayout() {
    this.setLayout(this.theme() === 'full' ? 'fixed' : 'full')
  }
}
