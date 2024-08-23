import { Component } from "@angular/core";

import { UbInputDirective } from "@/registry/default/ui/input.directive";
import { UbLabelDirective } from "@/registry/default/ui/label.directive";

@Component({
    standalone: true,
    selector: "input-file-default",
    imports: [UbInputDirective, UbLabelDirective],
    template: `
    <div class="grid w-full max-w-sm items-center gap-1.5">
      <label ubLabel htmlFor="picture">Picture</label>
      <input ubInput id="picture" type="file" />
    </div>
  `,
})
export class InputFileDefault { }

export default InputFileDefault;
