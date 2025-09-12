import { Component } from '@angular/core'

import { UbAccordionContentDirective, UbAccordionDirective, UbAccordionItemDirective, UbAccordionTriggerDirective } from '@/registry/new-york-v4/ui/accordion'

@Component({
  standalone: true,
  imports: [UbAccordionDirective, UbAccordionItemDirective, UbAccordionTriggerDirective, UbAccordionContentDirective],
  template: `
    <div ubAccordion class="w-full" orientation="vertical" type="single" collapsible defaultValue="item-1">
      <div ubAccordionItem value="item-1">
        <ub-accordion-trigger>Product Information</ub-accordion-trigger>
        <div ubAccordionContent class="flex flex-col gap-4 text-balance">
          <p>
            Our flagship product combines cutting-edge technology with sleek
            design. Built with premium materials, it offers unparalleled
            performance and reliability.
          </p>
          <p>
            Key features include advanced processing capabilities, and an
            intuitive user interface designed for both beginners and experts.
          </p>
        </div>
      </div>
      <div ubAccordionItem value="item-2">
        <ub-accordion-trigger>Shipping Details</ub-accordion-trigger>
        <div ubAccordionContent class="flex flex-col gap-4 text-balance">
          <p>
            We offer worldwide shipping through trusted courier partners.
            Standard delivery takes 3-5 business days, while express shipping
            ensures delivery within 1-2 business days.
          </p>
          <p>
            All orders are carefully packaged and fully insured. Track your
            shipment in real-time through our dedicated tracking portal.
          </p>
        </div>
      </div>
      <div ubAccordionItem value="item-3">
        <ub-accordion-trigger>Return Policy</ub-accordion-trigger>
        <div ubAccordionContent class="flex flex-col gap-4 text-balance">
          <p>
            We stand behind our products with a comprehensive 30-day return
            policy. If you&apos;re not completely satisfied, simply return the
            item in its original condition.
          </p>
          <p>
            Our hassle-free return process includes free return shipping and
            full refunds processed within 48 hours of receiving the returned
            item.
          </p>
        </div>
      </div>
    </div>
    `,
})
export class AccordionDemo { }
