import { UbButtonDirective } from '@/registry/default/ui/button'
import { UbTextAreaDirective } from '@/registry/default/ui/textarea'
import { Component } from '@angular/core'

@Component({
  standalone: true,
  selector: '[textarea-with-label-default]',
  imports: [UbTextAreaDirective, UbButtonDirective],
  template: `
  <div class="grid w-full gap-2">
    <textarea ubTextarea placeholder="Type your message here."></textarea>
    <button ubButton>Send message</button>
  </div>`,
})
export default class TextAreaWithButtonDefault { }
