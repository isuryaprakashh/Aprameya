import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full bg-transparent border border-hairline-2 rounded-[var(--r-2)] p-3.5 text-base sm:text-sm text-paper font-sans placeholder:text-mute transition-colors duration-fast",
          "focus-visible:outline-none focus-visible:border-focus focus-visible:ring-2 focus-visible:ring-signal-soft",
          "disabled:cursor-not-allowed disabled:opacity-40",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
