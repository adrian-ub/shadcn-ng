import { Component } from '@angular/core'
import { UbTextAreaDirective } from '@/registry/new-york/ui/textarea'

@Component({
  standalone: true,
  selector: '[textarea-demo-new-york]',
  imports: [UbTextAreaDirective],
  template: `<textarea ubTextarea placeholder="Type your message here."></textarea>`,
})
export default class TextAreaDemoNewYork { }
