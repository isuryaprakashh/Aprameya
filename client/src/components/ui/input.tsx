import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-[44px] w-full bg-transparent border border-hairline-2 rounded-[var(--r-2)] px-3.5 text-base sm:text-sm text-paper font-sans placeholder:text-mute transition-colors duration-fast",
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
Input.displayName = "Input"

export { Input }
