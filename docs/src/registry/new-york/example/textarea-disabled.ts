import { UbTextAreaDirective } from '@/registry/new-york/ui/textarea'
import { Component } from '@angular/core'

@Component({
  standalone: true,
  selector: '[textarea-disabled-new-york]',
  imports: [UbTextAreaDirective],
  template: `<textarea ubTextarea placeholder="Type your message here." disabled></textarea>`,
})
export default class TextAreaDisabledNewYork { }
