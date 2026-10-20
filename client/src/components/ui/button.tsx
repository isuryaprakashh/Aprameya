import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-body font-medium transition-colors duration-fast border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-40 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer shadow-none",
  {
    variants: {
      variant: {
        default:
          "bg-red text-white border-transparent hover:bg-red-hover active:bg-red-hover",
        primary:
          "bg-red text-white border-transparent hover:bg-red-hover active:bg-red-hover",
        inverse:
          "bg-invert-bg text-invert-text border-transparent hover:opacity-90 active:opacity-90",
        secondary:
          "bg-transparent text-text border-border-strong hover:bg-surface-2 active:bg-surface-2",
        destructive:
          "bg-transparent text-red-text border-red-line hover:bg-red-soft active:bg-red-soft",
        danger:
          "bg-transparent text-red-text border-red-line hover:bg-red-soft active:bg-red-soft",
        outline:
          "border border-border-strong bg-transparent text-text hover:bg-surface-2",
        ghost:
          "border-transparent bg-transparent text-text-2 hover:text-text hover:bg-surface-2",
        link:
          "text-text hover:text-white border-transparent p-0 h-auto underline-offset-4 hover:underline",
        icon:
          "bg-transparent text-text-2 border-transparent hover:text-text hover:bg-surface-2 p-2 rounded-md",
      },
      size: {
        default: "h-10 px-4 text-[14px] rounded-md",
        sm: "h-8 px-3 text-[13px] rounded-md",
        md: "h-10 px-4 text-[14px] rounded-md",
        lg: "h-12 px-6 text-[15px] rounded-md",
        icon: "h-10 w-10 rounded-md",
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
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
