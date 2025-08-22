import { Component } from '@angular/core'
import { UbTextAreaDirective } from '@/registry/new-york/ui/textarea'

@Component({
  standalone: true,
  selector: '[textarea-disabled-new-york]',
  imports: [UbTextAreaDirective],
  template: `<textarea ubTextarea placeholder="Type your message here." disabled></textarea>`,
})
export default class TextAreaDisabledNewYork { }
