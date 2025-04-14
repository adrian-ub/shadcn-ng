import { Component } from '@angular/core'

import {
  UbPaginationContentDirective,
  UbPaginationDirective,
  UbPaginationEllipsisComponent,
  UbPaginationItemDirective,
  UbPaginationLinkDirective,
  UbPaginationNextDirective,
  UbPaginationPreviousDirective,
} from '~/registry/new-york/ui/pagination'

@Component({
  standalone: true,
  selector: '[pagination-demo-new-york]',
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
export default class PaginationDemoNewYork { }
