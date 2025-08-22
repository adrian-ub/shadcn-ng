import { Component } from '@angular/core'
import { UbLabelDirective } from '@/registry/new-york/ui/label'
import { UbTextAreaDirective } from '@/registry/new-york/ui/textarea'

@Component({
  standalone: true,
  selector: '[textarea-with-label-new-york]',
  imports: [UbTextAreaDirective, UbLabelDirective],
  template: `
  <div class="grid w-full gap-1.5">
    <label ubLabel for="message">Your message</label>
    <textarea ubTextarea placeholder="Type your message here." id="message"></textarea>
  </div>`,
})
export default class TextAreaWithLabelNewYork { }
