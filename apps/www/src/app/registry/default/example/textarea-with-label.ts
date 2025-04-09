import { UbLabelDirective } from '@/registry/default/ui/label'
import { UbTextAreaDirective } from '@/registry/default/ui/textarea'
import { Component } from '@angular/core'

@Component({
  standalone: true,
  selector: '[textarea-with-label-default]',
  imports: [UbTextAreaDirective, UbLabelDirective],
  template: `
  <div class="grid w-full gap-1.5">
    <label ubLabel for="message">Your message</label>
    <textarea ubTextarea placeholder="Type your message here." id="message"></textarea>
  </div>`,
})
export default class TextAreaWithLabelDefault { }
