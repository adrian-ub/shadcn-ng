import { computed, Directive, input } from "@angular/core";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type AlertProps = VariantProps<typeof alertVariants>;
type UbAlertVariant = NonNullable<AlertProps["variant"]>;

@Directive({
  selector: "div[ubAlert]",
  standalone: true,
  host: {
    role: "alert",
    "[class]": "computedClass()",
  },
})
export class UbAlertDirective {
  readonly class = input<string>();
  readonly variant = input<UbAlertVariant>("default");

  protected computedClass = computed(() =>
    cn(alertVariants({ variant: this.variant(), class: this.class() }))
  );
}

@Directive({
  selector: "h5[ubAlertTitle]",
  standalone: true,
  host: {
    "[class]": "computedClass()",
  },
})
export class UbAlertTitleDirective {
  readonly class = input<string>();

  protected computedClass = computed(() =>
    cn("mb-1 font-medium leading-none tracking-tight", this.class())
  );
}

@Directive({
  selector: "div[ubAlertDescription]",
  standalone: true,
  host: {
    "[class]": "computedClass()",
  },
})
export class UbAlertDescriptionDirective {
  readonly class = input<string>();

  protected computedClass = computed(() =>
    cn("text-sm [&_p]:leading-relaxed", this.class())
  );
}
