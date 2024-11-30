import {
  UbPaginationContentDirective,
  UbPaginationDirective,
  UbPaginationEllipsisComponent,
  UbPaginationItemDirective,
  UbPaginationLinkDirective,
  UbPaginationNextDirective,
  UbPaginationPreviousDirective,
} from '@/registry/default/ui/pagination'

import { Component } from '@angular/core'

@Component({
  standalone: true,
  selector: '[pagination-demo-default]',
  imports: [
    UbPaginationContentDirective,
    UbPaginationDirective,
    UbPaginationEllipsisComponent,
    UbPaginationItemDirective,
    UbPaginationLinkDirective,
    UbPaginationNextDirective,
    UbPaginationPreviousDirective,
  ],
  template: `
  <nav ubPagination>
    <ul ubPaginationContent>
      <li ubPaginationItem>
        <a href="#" ubPaginationPrevious></a>
      </li>
      <li ubPaginationItem>
        <a ubPaginationLink href="#">1</a>
      </li>
      <li ubPaginationItem>
        <a ubPaginationLink href="#" isActive>2</a>
      </li>
      <li ubPaginationItem>
        <a ubPaginationLink href="#">3</a>
      </li>
      <li ubPaginationItem>
        <ub-pagination-ellipsis />
      </li>
      <li ubPaginationItem>
        <a href="#" ubPaginationNext></a>
      </li>
    </ul>
  </nav>
  `,
})
export default class PaginationDemoDefault { }