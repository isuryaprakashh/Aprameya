import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-[var(--r-full)] border transition-all duration-fast select-none focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-hairline-2 bg-surface-2/80 dark:bg-surface-2/70 text-text-2 dark:text-text-2 font-medium hover:bg-surface-3 hover:text-paper hover:border-hairline-3 shadow-xs",
        tag:
          "border-hairline-2 bg-surface-2/80 dark:bg-surface-2/70 text-text-2 dark:text-text-2 font-medium hover:bg-surface-3 hover:text-paper hover:border-hairline-3 shadow-xs",
        selected:
          "border-signal/50 bg-signal/10 dark:bg-signal/15 text-signal dark:text-signal-text font-semibold shadow-xs ring-1 ring-signal/20",
        secondary:
          "border-hairline-2 bg-surface-2 text-paper font-medium shadow-xs hover:bg-surface-3",
        accent:
          "border-signal/40 bg-signal-soft text-signal-text font-medium shadow-xs",
        destructive:
          "border-signal/50 bg-signal-soft text-signal-text font-medium",
        outline:
          "border-hairline-2 bg-transparent text-text-2 dark:text-text-2 hover:bg-surface-2/50 hover:text-paper",
      },
      size: {
        default: "h-7 px-3 text-[12px] gap-1.5",
        dense: "h-6 px-2.5 text-[11px] gap-1 font-mono tracking-tight",
        sm: "h-5 px-2 text-[10px] gap-1 font-mono",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  selected?: boolean;
}

function Badge({ className, variant, size, selected, ...props }: BadgeProps) {
  const appliedVariant = selected ? "selected" : variant;
  return (
    <div className={cn(badgeVariants({ variant: appliedVariant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants, Badge as Tag, Badge as Chip }
