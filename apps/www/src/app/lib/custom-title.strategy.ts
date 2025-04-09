import type { RouterStateSnapshot } from '@angular/router'
import { inject, Injectable } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { TitleStrategy } from '@angular/router'

@Injectable({ providedIn: 'root' })
export class CustomTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title)
  override updateTitle(routerState: RouterStateSnapshot): void {
    const title = this.buildTitle(routerState)
    const titleSuffix = 'shadcn-ng'

    if (!title) {
      this.title.setTitle(titleSuffix)
    }
    else {
      this.title.setTitle(`${title} - ${titleSuffix}`)
    }
  }
}
