import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-[var(--r-full)] border px-2.5 py-0.5 text-[12px] font-sans font-medium transition-colors select-none focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-hairline bg-transparent text-text-2 hover:border-hairline-2 hover:text-paper",
        tag:
          "border-hairline bg-transparent text-text-2 hover:border-hairline-2 hover:text-paper",
        selected:
          "border-signal-line bg-signal-soft text-signal-text",
        secondary:
          "border-hairline bg-surface-2 text-paper",
        destructive:
          "border-signal-line bg-signal-soft text-signal-text",
        outline:
          "border-hairline text-text-2",
      },
      size: {
        default: "h-7 px-2.5",
        dense: "h-6 px-2 text-[11px]",
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
