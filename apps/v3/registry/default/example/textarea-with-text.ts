import { Component } from '@angular/core'
import { UbLabelDirective } from '@/registry/default/ui/label'
import { UbTextAreaDirective } from '@/registry/default/ui/textarea'

@Component({
  standalone: true,
  selector: '[textarea-with-text-default]',
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
export default class TextAreaWithTextDefault { }
