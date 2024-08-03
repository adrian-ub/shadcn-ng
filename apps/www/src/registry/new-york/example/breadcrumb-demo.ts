import { Component } from "@angular/core";

import {
  UbBreadcrumbDirective,
  UbBreadcrumbListDirective,
  UbBreadcrumbItemDirective,
  UbBreadcrumbLinkDirective,
  UbBreadcrumbSeparatorComponent,
  UbBreadcrumbEllipsisComponent,
  UbBreadcrumbPageDirective,
} from "@/registry/new-york/ui/breadcrumb.directive";

@Component({
  standalone: true,
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
export class BreadcrumbDemoComponent {}

export default BreadcrumbDemoComponent;
