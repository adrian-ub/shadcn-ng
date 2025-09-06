import type {
  AfterViewInit,
} from '@angular/core'
import { isPlatformBrowser } from '@angular/common'
import {
  afterNextRender,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Injector,
  PLATFORM_ID,
  signal,
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { NavigationEnd, Router } from '@angular/router'
import { filter } from 'rxjs/operators'

@Component({
  selector: 'docs-toc',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  @if(links().length > 0) {
    <div class="no-scrollbar overflow-y-auto px-8">
      <div class="flex flex-col gap-2 p-4 pt-0 text-sm">
        <p class="text-muted-foreground bg-background sticky top-0 h-6 text-xs">On This Page</p>
        @for (link of links(); track $index) {
          <a (click)="scrollTo(link.id)"
             class="text-muted-foreground hover:text-foreground data-[active=true]:text-foreground text-[0.8rem] no-underline transition-colors data-[depth=3]:pl-4 data-[depth=4]:pl-6"
             [attr.data-depth]="link.level"
             [attr.data-active]="activeId() === link.id">
            {{link.text}}
          </a>
        }
      </div>
      <div class="h-12"></div>
    </div>
  }
  `,
})
export class DocsToc implements AfterViewInit {
  private readonly router = inject(Router)
  private readonly platformId = inject(PLATFORM_ID)
  private readonly injector = inject(Injector)
  private readonly changeDetector = inject(ChangeDetectorRef)
  protected links = signal<{ level: number, id: string, text: string | null }[]>([])

  constructor() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        afterNextRender(
          () => {
            setTimeout(() => {
              this.updateHeadings()
            }, 100)
          },
          { injector: this.injector },
        )
      })
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.updateHeadings()
        const observer = new MutationObserver(() => {
          this.updateHeadings()
        })

        const content = document.querySelector('analog-markdown')
        if (content) {
          observer.observe(content, {
            childList: true,
            subtree: true,
          })
        }
      }, 100)
    }
  }

  protected activeId = signal<string | null>(null)

  private updateHeadings(): void {
    const headings = getHeadingList()
    if (headings.length > 0) {
      this.links.set(headings)
      this.setupIntersectionObserver(headings)
      this.changeDetector.detectChanges()
    }
  }

  private setupIntersectionObserver(headings: { id: string }[]): void {
    if (!isPlatformBrowser(this.platformId))
      return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.activeId.set(entry.target.id)
            break
          }
        }
      },
      {
        rootMargin: '-100px 0px -50% 0px',
      },
    )

    headings.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })
  }

  scrollTo(id: string): void {
    window.scrollTo({
      top: document.getElementById(id)?.offsetTop,
      behavior: 'smooth',
    })
  }
}

function getHeadingList() {
  let foundHeadings = document.querySelector('analog-markdown')?.shadowRoot?.querySelector('.analog-markdown')?.querySelectorAll('h2, h3, h4')

  if (!foundHeadings?.length) {
    foundHeadings = document.querySelector('analog-markdown .analog-markdown')?.querySelectorAll('h2, h3, h4')

    if (!foundHeadings?.length) {
      return []
    }
  }

  return Array.from(foundHeadings).map((heading) => {
    return {
      level: Number.parseInt(heading.tagName.slice(1)),
      id: heading.id,
      text: heading.textContent,
    }
  })
}
