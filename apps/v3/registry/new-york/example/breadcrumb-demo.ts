import { Component } from '@angular/core'

import {
  UbBreadcrumbDirective,
  UbBreadcrumbEllipsisComponent,
  UbBreadcrumbItemDirective,
  UbBreadcrumbLinkDirective,
  UbBreadcrumbListDirective,
  UbBreadcrumbPageDirective,
  UbBreadcrumbSeparatorComponent,
} from '@/registry/new-york/ui/breadcrumb'

@Component({
  standalone: true,
  selector: '[breadcrumb-demo-new-york]',
  imports: [
    UbBreadcrumbDirective,
    UbBreadcrumbListDirective,
    UbBreadcrumbItemDirective,
    UbBreadcrumbLinkDirective,
    UbBreadcrumbSeparatorComponent,
    UbBreadcrumbEllipsisComponent,
    UbBreadcrumbPageDirective,
  ],
  template: `
    <nav ubBreadcrumb>
      <ol ubBreadcrumbList>
        <li ubBreadcrumbItem>
          <a ubBreadcrumbLink>Home</a>
        </li>
        <li ubBreadcrumbSeparator></li>
        <li ubBreadcrumbItem>
          <span ubBreadcrumbEllipsis></span>
        </li>
        <li ubBreadcrumbSeparator></li>
        <li ubBreadcrumbItem>
          <a ubBreadcrumbLink>Components</a>
        </li>
        <li ubBreadcrumbSeparator></li>
        <li ubBreadcrumbItem>
          <span ubBreadcrumbPage>Breadcrumb</span>
        </li>
      </ol>
    </nav>
  `,
})
export default class BreadcrumbDemoNewYork { }
