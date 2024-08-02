import { Component } from "@angular/core";

@Component({
  standalone: true,
  template: `
    <p class="text-xl text-muted-foreground">
      A modal dialog that interrupts the user with important content and expects
      a response.
    </p>
  `,
})
export class TypographyLeadComponent {}

export default TypographyLeadComponent;
