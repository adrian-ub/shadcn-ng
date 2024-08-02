import { Component } from "@angular/core";

@Component({
  standalone: true,
  template: `
    <code
      class="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
    >
      {{ "@" }}radix-ui/react-alert-dialog
    </code>
  `,
})
export class TypographyInlineCodeComponent {}

export default TypographyInlineCodeComponent;
