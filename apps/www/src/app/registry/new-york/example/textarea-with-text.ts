import { UbLabelDirective } from '@/registry/new-york/ui/label'
import { UbTextAreaDirective } from '@/registry/new-york/ui/textarea'
import { Component } from '@angular/core'

@Component({
  standalone: true,
  selector: '[textarea-with-text-new-york]',
  imports: [UbTextAreaDirective, UbLabelDirective],
  template: `
  <div class="grid w-full gap-1.5">
    <label ubLabel for="message">Your message</label>
    <textarea ubTextarea placeholder="Type your message here." id="message"></textarea>
    <p class="text-sm text-muted-foreground">
      Your message will be copied to the support team.
    </p>
  </div>`,
})
export default class TextAreaWithTextNewYork { }
