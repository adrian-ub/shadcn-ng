import { Component } from '@angular/core';

import { UbAccordionDirective, UbAccordionItemDirective, UbAccordionTriggerDirective, UbAccordionContentDirective } from '@/registry/new-york/ui/accordion.directive'

@Component({
    standalone: true,
    selector: 'accordion-demo-default',
    imports: [UbAccordionDirective, UbAccordionItemDirective, UbAccordionTriggerDirective, UbAccordionContentDirective],
    template: `
        <div ubAccordion class="w-full" orientation="vertical">
            <div ubAccordionItem value="item-1">
                <ub-accordion-trigger>Is it accessible?</ub-accordion-trigger>
                <div ubAccordionContent>
                    Yes. It adheres to the WAI-ARIA design pattern.
                </div>
            </div>
            <div ubAccordionItem value="item-2">
                <ub-accordion-trigger>Is it styled?</ub-accordion-trigger>
                <div ubAccordionContent>
                    Yes. It comes with default styles that matches the other components&apos; aesthetic.
                </div>
            </div>
            <div ubAccordionItem value="item-3">
                <ub-accordion-trigger>Is it animated?</ub-accordion-trigger>
                <div ubAccordionContent>
                    Yes. It&apos;s animated by default, but you can disable it if you prefer.
                </div>
            </div>
        </div>
    `
})
export class AccordionDemoDefault { }

export default AccordionDemoDefault;
