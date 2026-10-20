import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full bg-transparent border border-border-strong rounded-md p-3.5 text-sm text-text font-body placeholder:text-text-3 transition-colors duration-fast",
          "focus-visible:outline-none focus-visible:border-focus-ring focus-visible:ring-2 focus-visible:ring-red-soft",
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
