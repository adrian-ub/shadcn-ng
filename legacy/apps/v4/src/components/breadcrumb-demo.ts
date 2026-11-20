import { Component } from '@angular/core'

import {
  UbBreadcrumbDirective,
  UbBreadcrumbEllipsisComponent,
  UbBreadcrumbItemDirective,
  UbBreadcrumbLinkDirective,
  UbBreadcrumbListDirective,
  UbBreadcrumbPageDirective,
  UbBreadcrumbSeparatorComponent,
} from '~/registry/new-york-v4/ui/breadcrumb'
import {
  UbDropdownMenuContentDirective,
  UbDropdownMenuItemDirective,
  UbDropdownMenuTriggerDirective,
} from '~/registry/new-york-v4/ui/dropdown-menu'

@Component({
  selector: 'BreadcrumbDemo',
  imports: [
    UbBreadcrumbDirective,
    UbBreadcrumbListDirective,
    UbBreadcrumbItemDirective,
    UbBreadcrumbLinkDirective,
    UbBreadcrumbSeparatorComponent,
    UbBreadcrumbEllipsisComponent,
    UbBreadcrumbPageDirective,

    UbDropdownMenuTriggerDirective,
    UbDropdownMenuContentDirective,
    UbDropdownMenuItemDirective,
  ],
  template: `
  <nav ubBreadcrumb>
    <ol ubBreadcrumbList>
      <li ubBreadcrumbItem>
        <a ubBreadcrumbLink href="/">Home</a>
      </li>
      <li ubBreadcrumbSeparator></li>
      <li ubBreadcrumbItem>
        <button [ubDropdownMenuTrigger]="menu" class="flex items-center gap-1">
          <span ubBreadcrumbEllipsis class="h-4 w-4"></span>
          <span class="sr-only">Toggle menu</span>
        </button>
        <ng-template #menu>
          <div ubDropdownMenuContent>
            <div ubDropdownMenuItem>Documentation</div>
            <div ubDropdownMenuItem>Themes</div>
            <div ubDropdownMenuItem>GitHub</div>
          </div>
        </ng-template>
      </li>
      <li ubBreadcrumbSeparator></li>
      <li ubBreadcrumbItem>
        <a ubBreadcrumbLink href="/docs/components">Components</a>
      </li>
      <li ubBreadcrumbSeparator></li>
      <li ubBreadcrumbItem>
        <span ubBreadcrumbPage>Breadcrumb</span>
      </li>
    </ol>
  </nav>
  `,
})
export default class BreadcrumbDemo { }
