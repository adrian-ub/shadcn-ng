import { Component } from "@angular/core";

@Component({
    standalone: true,
    selector: "typography-small-default",
    template: `
    <small class="text-sm font-medium leading-none">Email address</small>
  `,
})
export class TypographySmallDefault { }

export default TypographySmallDefault;
