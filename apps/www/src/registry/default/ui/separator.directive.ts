import { cn } from "@/lib/utils";
import { computed, Directive, input } from "@angular/core";

@Directive({
  standalone: true,
  selector: "[ubSeperator]",
  host: {
    "[class]": "computedClass()",
  },
})
export class UbSepearatorDirective {
  readonly class = input<string>();
  readonly orientation = input<"horizontal" | "vertical">("horizontal");

  protected computedClass = computed(() =>
    cn(
      "shrink-0 bg-border",
      this.orientation() === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      this.class()
    )
  );
}
