import { computed, Directive, input } from "@angular/core";

import { cn } from "@/lib/utils";

@Directive({
  selector: "table[ubTable]",
  standalone: true,
  host: {
    "[class]": "computedClass()",
  },
})
export class UbTableDirective {
  readonly class = input<string>("");
  protected computedClass = computed(() =>
    cn("w-full caption-bottom text-sm", this.class())
  );
}

@Directive({
  selector: "thead[ubTableHeader]",
  standalone: true,
  host: {
    "[class]": "computedClass()",
  },
})
export class UbTableHeaderDirective {
  readonly class = input<string>("");
  protected computedClass = computed(() => cn("[&_tr]:border-b", this.class()));
}

@Directive({
  selector: "tbody[ubTableBody]",
  standalone: true,
  host: {
    "[class]": "computedClass()",
  },
})
export class UbTableBodyDirective {
  readonly class = input<string>("");
  protected computedClass = computed(() =>
    cn("[&_tr:last-child]:border-0", this.class())
  );
}

@Directive({
  selector: "tfoot[ubTableFooter]",
  standalone: true,
  host: {
    "[class]": "computedClass()",
  },
})
export class UbTableFooterDirective {
  readonly class = input<string>("");
  protected computedClass = computed(() =>
    cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", this.class())
  );
}

@Directive({
  selector: "tr[ubTableRow]",
  standalone: true,
  host: {
    "[class]": "computedClass()",
  },
})
export class UbTableRowDirective {
  readonly class = input<string>("");
  protected computedClass = computed(() =>
    cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      this.class()
    )
  );
}

@Directive({
  selector: "th[ubTableHead]",
  standalone: true,
  host: {
    "[class]": "computedClass()",
  },
})
export class UbTableHeadDirective {
  readonly class = input<string>("");
  protected computedClass = computed(() =>
    cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      this.class()
    )
  );
}

@Directive({
  selector: "td[ubTableCell]",
  standalone: true,
  host: {
    "[class]": "computedClass()",
  },
})
export class UbTableCellDirective {
  readonly class = input<string>("");
  protected computedClass = computed(() =>
    cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", this.class())
  );
}

@Directive({
  selector: "caption[ubTableCaption]",
  standalone: true,
  host: {
    "[class]": "computedClass()",
  },
})
export class UbTableCaptionDirective {
  readonly class = input<string>("");
  protected computedClass = computed(() =>
    cn("mt-4 text-sm text-muted-foreground", this.class())
  );
}
