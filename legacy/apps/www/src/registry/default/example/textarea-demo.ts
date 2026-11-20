import { Component } from '@angular/core'
import { UbTextAreaDirective } from '~/registry/default/ui/textarea'

@Component({
  standalone: true,
  selector: '[textarea-demo-default]',
  imports: [UbTextAreaDirective],
  template: `<textarea ubTextarea placeholder="Type your message here."></textarea>`,
})
export default class TextAreaDemoDefault { }
