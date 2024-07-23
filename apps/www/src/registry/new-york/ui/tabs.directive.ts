import { computed, Directive, Input, input } from "@angular/core";

import {
  RdxTabsContentDirective,
  RdxTabsListDirective,
  RdxTabsRootDirective,
  RdxTabsTriggerDirective,
} from "@radix-ng/primitives/tabs";

import { cn } from "@/lib/utils";

@Directive({
  selector: "[ubTabs]",
  standalone: true,
  hostDirectives: [
    {
      directive: RdxTabsRootDirective,
      inputs: ["defaultValue: ubDefaultValue"],
    },
  ],
})
export class UbTabsDirective {
  @Input() ubDefaultValue?: string;
}

@Directive({
  selector: "[ubTabsList]",
  standalone: true,
  hostDirectives: [RdxTabsListDirective],
  host: {
    "[class]": "computedClass()",
  },
})
export class UbTabsListDirective {
  readonly class = input<string>();
  protected computedClass = computed(() =>
    cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      this.class()
    )
  );
}

@Directive({
  selector: "[ubTabsTrigger]",
  standalone: true,
  hostDirectives: [
    { directive: RdxTabsTriggerDirective, inputs: ["value: value"] },
  ],
  host: {
    "[class]": "computedClass()",
  },
})
export class UbTabsTriggerDirective {
  readonly value = input.required<string>();

  readonly class = input<string>();
  protected computedClass = computed(() =>
    cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
      this.class()
    )
  );
}

@Directive({
  selector: "[ubTabsContent]",
  standalone: true,
  hostDirectives: [
    { directive: RdxTabsContentDirective, inputs: ["value: value"] },
  ],
  host: {
    "[class]": "computedClass()",
  },
})
export class UbTabsContentDirective {
  readonly value = input.required<string>();

  readonly class = input<string>();
  protected computedClass = computed(() =>
    cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      this.class()
    )
  );
}
