import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("skeleton-shimmer rounded-[var(--r-2)] border border-hairline/40", className)}
      {...props}
    />
  )
}

export { Skeleton }
