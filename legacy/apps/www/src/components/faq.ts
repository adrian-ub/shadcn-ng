import { Component } from '@angular/core'

import {
  UbAccordionContentDirective,
  UbAccordionDirective,
  UbAccordionItemDirective,
  UbAccordionTriggerDirective,
} from '~/registry/new-york/ui/accordion'

@Component({
  standalone: true,
  imports: [
    UbAccordionDirective,
    UbAccordionItemDirective,
    UbAccordionTriggerDirective,
    UbAccordionContentDirective,
  ],
  selector: 'shadcn-ng-faq',
  template: `
  <div ubAccordion type="multiple">
    <div ubAccordionItem value="faq-1">
      <h3 ubAccordionTrigger>What is the meaning of life?</h3>
      <div ubAccordionContent>
        <p class="leading-7 [&:not(:first-child)]:mt-6">The idea behind this is to give you ownership and control over the code, allowing you to decide how the components are built and styled.</p>

        <p class="leading-7 [&:not(:first-child)]:mt-6">Start with some sensible defaults, then customize the components to your needs.</p>

        <p class="leading-7 [&:not(:first-child)]:mt-6">One of the drawbacks of packaging the components in an npm package is that the style is coupled with the implementation. <em>The design of your components should be separate from their implementation.</em></p>
      </div>
    </div>

    <div ubAccordionItem value="faq-2">
      <h3 ubAccordionTrigger>Do you plan to publish it as an npm package?</h3>
      <div ubAccordionContent>No. I have no plans to publish it as an npm package.</div>
    </div>

    <div ubAccordionItem value="faq-3">
      <h3 ubAccordionTrigger>Which frameworks are supported?</h3>
      <div ubAccordionContent>You can use any framework that supports Angular.</div>
    </div>

    <div ubAccordionItem value="faq-4">
      <h3 ubAccordionTrigger>Can I use this in my project?</h3>
      <div ubAccordionContent>
      <p class="leading-7 [&:not(:first-child)]:mt-6">Yes. Free to use for personal and commercial projects. No attribution required.</p>
      <p class="leading-7 [&:not(:first-child)]:mt-6">But hey, let me know if you do. I'd love to see what you build.</p>
      </div>
    </div>
  </div>
  `,
})
export class Faq { }
