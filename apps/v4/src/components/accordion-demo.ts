import { Component } from '@angular/core'

import { UbAccordionContentDirective, UbAccordionDirective, UbAccordionItemDirective, UbAccordionTriggerDirective } from '~/registry/new-york-v4/ui/accordion'

@Component({
  standalone: true,
  selector: '[accordion-demo-new-york]',
  imports: [UbAccordionDirective, UbAccordionItemDirective, UbAccordionTriggerDirective, UbAccordionContentDirective],
  template: `
  <div class="grid w-full max-w-xl gap-4">
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

    <div ubAccordion class="w-full" collapsible>
      <div ubAccordionItem value="item-1">
          <ub-accordion-trigger>
            What are the key considerations when implementing a comprehensive
            enterprise-level authentication system?
          </ub-accordion-trigger>
          <div ubAccordionContent>
            Implementing a robust enterprise authentication system requires
            careful consideration of multiple factors. This includes secure
            password hashing and storage, multi-factor authentication (MFA)
            implementation, session management, OAuth2 and SSO integration,
            regular security audits, rate limiting to prevent brute force
            attacks, and maintaining detailed audit logs. Additionally,
            you&apos;ll need to consider scalability, performance impact, and
            compliance with relevant data protection regulations such as GDPR or
            HIPAA.
        </div>
      </div>
      <div ubAccordionItem value="item-2">
          <ub-accordion-trigger>
            How does modern distributed system architecture handle eventual
            consistency and data synchronization across multiple regions?
          </ub-accordion-trigger>
          <div ubAccordionContent>
            Modern distributed systems employ various strategies to maintain
            data consistency across regions. This often involves using
            techniques like CRDT (Conflict-Free Replicated Data Types), vector
            clocks, and gossip protocols. Systems might implement event sourcing
            patterns, utilize message queues for asynchronous updates, and
            employ sophisticated conflict resolution strategies. Popular
            solutions like Amazon&apos;s DynamoDB and Google&apos;s Spanner
            demonstrate different approaches to solving these challenges,
            balancing between consistency, availability, and partition tolerance
            as described in the CAP theorem.
          </div>
        </div>
    </div>
  </div>
    `,
})
export default class AccordionDemoNewYork { }
