import { UbTextAreaDirective } from '@/registry/default/ui/textarea'
import { Component } from '@angular/core'

@Component({
  standalone: true,
  selector: '[textarea-demo-default]',
  imports: [UbTextAreaDirective],
  template: `<textarea ubTextarea placeholder="Type your message here."></textarea>`,
})
export default class TextAreaDemoDefault { }
