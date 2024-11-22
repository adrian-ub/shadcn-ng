import { UbTextAreaDirective } from '@/registry/default/ui/textarea'
import { Component } from '@angular/core'

@Component({
  standalone: true,
  selector: '[textarea-disabled-default]',
  imports: [UbTextAreaDirective],
  template: `<textarea ubTextarea placeholder="Type your message here." disabled></textarea>`,
})
export default class TextAreaDisabledDefault { }
