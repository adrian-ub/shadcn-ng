import { Component } from "@angular/core";

import {
    UbTableDirective,
    UbTableCaptionDirective,
    UbTableHeaderDirective,
    UbTableRowDirective,
    UbTableHeadDirective,
    UbTableBodyDirective,
    UbTableCellDirective,
    UbTableFooterDirective,
} from "@/registry/default/ui/table.directive";

@Component({
    standalone: true,
    selector: "table-demo-default",
    imports: [
        UbTableDirective,
        UbTableCaptionDirective,
        UbTableHeaderDirective,
        UbTableRowDirective,
        UbTableHeadDirective,
        UbTableBodyDirective,
        UbTableCellDirective,
        UbTableFooterDirective,
    ],
    template: `
    <table ubTable>
      <caption ubTableCaption>
        A list of your recent invoices.
      </caption>

      <thead ubTableHeader>
        <tr ubTableRow>
          <th ubTableHead class="w-[100px]">Invoice</th>
          <th ubTableHead>Status</th>
          <th ubTableHead>Method</th>
          <th ubTableHead class="text-right">Amount</th>
        </tr>
      </thead>

      <tbody ubTableBody>
        @for (invoice of invoices; track $index) {
          <tr ubTableRow>
            <td ubTableCell class="font-medium">
              {{ invoice.invoice }}
            </td>
            <td ubTableCell>
              {{ invoice.paymentStatus }}
            </td>
            <td ubTableCell>
              {{ invoice.paymentMethod }}
            </td>
            <td ubTableCell class="text-right">
              {{ invoice.totalAmount }}
            </td>
          </tr>
        }
      </tbody>

      <tfoot ubTableFooter>
        <tr ubTableRow>
          <td ubTableCell colspan="3">Total</td>
          <td ubTableCell class="text-right">$2,500.00</td>
        </tr>
      </tfoot>
    </table>
  `,
})
export class TableDemoDefault {
    invoices = [
        {
            invoice: "INV001",
            paymentStatus: "Paid",
            totalAmount: "$250.00",
            paymentMethod: "Credit Card",
        },
        {
            invoice: "INV002",
            paymentStatus: "Pending",
            totalAmount: "$150.00",
            paymentMethod: "PayPal",
        },
        {
            invoice: "INV003",
            paymentStatus: "Unpaid",
            totalAmount: "$350.00",
            paymentMethod: "Bank Transfer",
        },
        {
            invoice: "INV004",
            paymentStatus: "Paid",
            totalAmount: "$450.00",
            paymentMethod: "Credit Card",
        },
        {
            invoice: "INV005",
            paymentStatus: "Paid",
            totalAmount: "$550.00",
            paymentMethod: "PayPal",
        },
        {
            invoice: "INV006",
            paymentStatus: "Pending",
            totalAmount: "$200.00",
            paymentMethod: "Bank Transfer",
        },
        {
            invoice: "INV007",
            paymentStatus: "Unpaid",
            totalAmount: "$300.00",
            paymentMethod: "Credit Card",
        },
    ];
}

export default TableDemoDefault;
