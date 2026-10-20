import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Check, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans font-medium transition-colors duration-fast rounded-[var(--r-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:pointer-events-none disabled:opacity-40 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer shadow-none select-none active:scale-[0.985]",
  {
    variants: {
      variant: {
        default:
          "bg-signal text-on-signal border-transparent hover:bg-signal-hover active:bg-signal-press",
        primary:
          "bg-signal text-on-signal border-transparent hover:bg-signal-hover active:bg-signal-press",
        inverse:
          "bg-invert-bg text-invert-text border-transparent hover:opacity-90 active:opacity-90",
        secondary:
          "bg-transparent text-paper border border-hairline-2 hover:bg-surface-2 hover:border-hairline-3 active:bg-surface-3",
        destructive:
          "bg-transparent text-signal-text border border-signal-line hover:bg-signal-soft active:bg-signal-soft",
        danger:
          "bg-transparent text-signal-text border border-signal-line hover:bg-signal-soft active:bg-signal-soft",
        outline:
          "border border-hairline-2 bg-transparent text-paper hover:bg-surface-2 hover:border-hairline-3",
        ghost:
          "border-transparent bg-transparent text-text-2 hover:text-paper hover:bg-surface-2 active:bg-surface-3",
        link:
          "text-paper hover:text-paper border-transparent p-0 h-auto underline-offset-4 hover:underline",
        icon:
          "bg-transparent text-text-2 border-transparent hover:text-paper hover:bg-surface-2 p-2",
      },
      size: {
        default: "h-10 px-4 text-[14px]",
        sm: "h-8 px-3 text-[13px]",
        md: "h-10 px-4 text-[14px]",
        lg: "h-12 px-6 text-[15px]",
        xl: "h-14 px-8 text-[16px]",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  success?: boolean
  successText?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, success = false, successText, type = "button", children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        type={asChild ? undefined : type}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            <span>{children}</span>
          </>
        ) : success ? (
          <>
            <Check className="size-4 text-ok" />
            <span>{successText || children}</span>
          </>
        ) : (
          children
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
