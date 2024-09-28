import { cn } from '@/lib/utils'
import { UbButtonDirective } from '@/registry/new-york/ui/button'
import { Clipboard } from '@angular/cdk/clipboard'
import { Component, computed, inject, input, signal } from '@angular/core'

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
