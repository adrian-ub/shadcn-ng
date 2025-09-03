import { Component, computed, input } from '@angular/core'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { cn } from '@/lib/utils'
import { UbButton } from '@/registry/new-york-v4/ui/button'

@Component({
  selector: 'main-nav',
  imports: [RouterLink, RouterLinkActive, UbButton],
  template: `
  <nav [class]="computedClass()">
    @for (item of navItems(); track $index) {
      <a [routerLink]="item.href" routerLinkActive="text-primary" ubButton variant="ghost" size="sm">{{ item.label }}</a>
    }
  </nav>
  `,
})
export class MainNav {
  readonly navItems = input<{ href: string, label: string }[]>()
  readonly class = input<string>()
  protected readonly computedClass = computed(() => cn('items-center gap-0.5', this.class()))
}
