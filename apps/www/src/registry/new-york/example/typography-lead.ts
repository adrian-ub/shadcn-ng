import { Component } from "@angular/core";

@Component({
    standalone: true,
    selector: "typography-lead-new-york",
    template: `
    <p class="text-xl text-muted-foreground">
      A modal dialog that interrupts the user with important content and expects
      a response.
    </p>
  `,
})
export class TypographyLeadNewYork { }

export default TypographyLeadNewYork;
