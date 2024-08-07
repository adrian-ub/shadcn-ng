import { Component } from "@angular/core";

@Component({
  standalone: true,
  template: `
    <ul class="my-6 ml-6 list-disc [&>li]:mt-2">
      <li>1st level of puns: 5 gold coins</li>
      <li>2nd level of jokes: 10 gold coins</li>
      <li>3rd level of one-liners : 20 gold coins</li>
    </ul>
  `,
})
export class TypographyListComponent {}

export default TypographyListComponent;
