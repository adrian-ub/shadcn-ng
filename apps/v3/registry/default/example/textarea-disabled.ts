import { Component } from '@angular/core'
import { UbTextAreaDirective } from '@/registry/default/ui/textarea'

@Component({
  standalone: true,
  selector: '[textarea-disabled-default]',
  imports: [UbTextAreaDirective],
  template: `<textarea ubTextarea placeholder="Type your message here." disabled></textarea>`,
})
export default class TextAreaDisabledDefault { }
