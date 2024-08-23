import { Component } from "@angular/core";

@Component({
    standalone: true,
    selector: "typography-blockquote-new-york",
    template: `
    <blockquote class="mt-6 border-l-2 pl-6 italic">
      "After all," he said, "everyone enjoys a good joke, so it's only fair that
      they should pay for the privilege."
    </blockquote>
  `,
})
export class TypographyBlockquoteNewYork { }

export default TypographyBlockquoteNewYork;
