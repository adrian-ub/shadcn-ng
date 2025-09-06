import { MarkdownComponent } from '@analogjs/content'
import { Component } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { injectDoc } from '@/data/docs'

@Component({
  selector: 'app-docs-slug',
  imports: [MarkdownComponent],
  template: `
    @if (data(); as doc) {
      <analog-markdown [content]="doc.content"></analog-markdown>
    } @else {
      <p>Not Found.</p>
    }
  `,
})
export default class DocsSlugPage {
  protected readonly data = toSignal(
    injectDoc(),
    { initialValue: null },
  )
}
