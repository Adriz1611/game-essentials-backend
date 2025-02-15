import * as React from "react"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300",
        destructive:
          "bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10",
        outline: "text-foreground bg-neutral-300/40 border-neutral-300",
        success:
          "bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  ...props
}) {
  return (<div className={cn(badgeVariants({ variant }), className)} {...props} />);
}

export { Badge, badgeVariants }
