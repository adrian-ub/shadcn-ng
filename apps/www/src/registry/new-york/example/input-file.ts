import { Component } from "@angular/core";

import { UbInputDirective } from "@/registry/new-york/ui/input.directive";
import { UbLabelDirective } from "@/registry/new-york/ui/label.directive";

@Component({
  standalone: true,
  imports: [UbInputDirective, UbLabelDirective],
  template: `
    <div class="grid w-full max-w-sm items-center gap-1.5">
      <label ubLabel htmlFor="picture">Picture</label>
      <input ubInput id="picture" type="file" />
    </div>
  `,
})
export class InputFileDemoComponent {}

export default InputFileDemoComponent;
