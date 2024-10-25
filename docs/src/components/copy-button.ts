import { cn } from '@/lib/utils'
import { UbButtonDirective } from '@/registry/new-york/ui/button'
import { Clipboard } from '@angular/cdk/clipboard'
import { Component, computed, HostListener, inject, input, signal } from '@angular/core'

@Component({
  standalone: true,
  selector: 'copy-button',
  imports: [UbButtonDirective],
  template: `
    <button ubButton variant="ghost" size="icon" [class]="computedClass()" (click)="copy()">
    <span class="sr-only">Copy</span>
    @if(isCopied()) {
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check "><path d="M20 6 9 17l-5-5"></path></svg>
    } @else {
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard "><rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path></svg>
    }
</button>
  `,
})
export class CopyButton {
  private cilpbard = inject(Clipboard)
  class = input<string>('')
  withMeta = input(false)
  rawString = input.required<string>()
  protected computedClass = computed(() => cn('p-1 rounded-md absolute top-4 right-4 text-zinc-50 hover:bg-zinc-700 hover:text-zinc-50 transition-colors h-6 w-6', this.class(), this.withMeta() && 'top-16'))
  protected isCopied = signal(false)

  copy(): void {
    this.cilpbard.copy(this.rawString())
    this.isCopied.set(true)
    setTimeout(() => {
      this.isCopied.set(false)
    }, 2000)
  }
}

@Component({
  standalone: true,
  selector: 'app-copy-npm-command-button',
  imports: [UbButtonDirective],
  template: `
    <div class="dropdown">
      <button (click)="toggleMenu()" ubButton variant="ghost" size="icon" [class]="computedClass()">
      <span class="sr-only">Copy</span>
        @if(hasCopied) {
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check "><path d="M20 6 9 17l-5-5"></path></svg>
        } @else {
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard "><rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path></svg>
        }
      </button>
      @if(menuOpen) {
        <div class="absolute right-0 z-10 mt-2 min-w-[8rem] origin-top-right rounded-md bg-background shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
        <div class="py-1" role="none">
          <button class="block px-4 py-2 text-sm text-primary hover:bg-secondary w-full text-left" (click)="copyCommand(commands().__npmCommand__, 'npm')">npm</button>
          <button class="block px-4 py-2 text-sm text-primary hover:bg-secondary w-full text-left" (click)="copyCommand(commands().__yarnCommand__, 'yarn')">yarn</button>
          <button class="block px-4 py-2 text-sm text-primary hover:bg-secondary w-full text-left" (click)="copyCommand(commands().__pnpmCommand__, 'pnpm')">pnpm</button>
          <button class="block px-4 py-2 text-sm text-primary hover:bg-secondary w-full text-left" (click)="copyCommand(commands().__bunCommand__, 'bun')">bun</button>
      </div>
        </div>
      }
    </div>
  `,
})
export class CopyNpmCommandButtonComponent {
  commands = input.required<{
    __npmCommand__: string
    __yarnCommand__: string
    __pnpmCommand__: string
    __bunCommand__: string
  }>()

  class = input<string>('')
  withMeta = input(false)
  protected computedClass = computed(() => cn('p-1 rounded-md absolute top-4 right-4 text-zinc-50 hover:bg-zinc-700 hover:text-zinc-50 transition-colors h-6 w-6', this.class(), this.withMeta() && 'top-16'))

  hasCopied = false
  menuOpen = false

  private clipboard = inject(Clipboard)

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!(event.target as Element).closest('.dropdown')) {
      this.menuOpen = false
    }
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen
  }

  copyCommand(value: string, _pm: string): void {
    this.clipboard.copy(value)
    // Implement event tracking if needed
    this.hasCopied = true
    this.menuOpen = false
    setTimeout(() => this.hasCopied = false, 2000)
  }
}
