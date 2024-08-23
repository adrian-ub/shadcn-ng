import { Component } from "@angular/core";

@Component({
    standalone: true,
    selector: "typography-inline-code-default",
    template: `
    <code class="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
      {{ "@" }}radix-ui/react-alert-dialog
    </code>
  `,
})
export class TypographyInlineCodeDefault { }

export default TypographyInlineCodeDefault;
