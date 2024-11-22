import { UbTextAreaDirective } from '@/registry/new-york/ui/textarea'
import { Component } from '@angular/core'

@Component({
  standalone: true,
  selector: '[textarea-demo-new-york]',
  imports: [UbTextAreaDirective],
  template: `<textarea ubTextarea placeholder="Type your message here."></textarea>`,
})
export default class TextAreaDemoNewYork { }
