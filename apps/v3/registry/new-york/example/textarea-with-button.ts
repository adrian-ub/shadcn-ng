import { Component } from '@angular/core'
import { UbButtonDirective } from '@/registry/new-york/ui/button'
import { UbTextAreaDirective } from '@/registry/new-york/ui/textarea'

@Component({
  standalone: true,
  selector: '[textarea-with-label-new-york]',
  imports: [UbTextAreaDirective, UbButtonDirective],
  template: `
  <div class="grid w-full gap-2">
    <textarea ubTextarea placeholder="Type your message here."></textarea>
    <button ubButton>Send message</button>
  </div>`,
})
export default class TextAreaWithButtonNewYork { }
