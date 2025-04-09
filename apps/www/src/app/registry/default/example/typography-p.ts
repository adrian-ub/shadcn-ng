import { Component } from '@angular/core'

@Component({
  standalone: true,
  selector: '[typography-p-default]',
  template: `
    <p class="leading-7 [&:not(:first-child)]:mt-6">
      The king, seeing how much happier his subjects were, realized the error of
      his ways and repealed the joke tax.
    </p>
  `,
})
export default class TypographyPDefault { }
