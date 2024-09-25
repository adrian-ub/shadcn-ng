import { UbInputDirective } from '@/registry/new-york/ui/input'

import { UbLabelDirective } from '@/registry/new-york/ui/label'
import { Component } from '@angular/core'

@Component({
  standalone: true,
  selector: 'input-file-new-york',
  imports: [UbInputDirective, UbLabelDirective],
  template: `
    <div class="grid w-full max-w-sm items-center gap-1.5">
      <label ubLabel htmlFor="picture">Picture</label>
      <input ubInput id="picture" type="file" />
    </div>
  `,
})
export class InputFileNewYork { }

export default InputFileNewYork
