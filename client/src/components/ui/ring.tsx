import * as React from "react";
import { cn } from "@/lib/utils";

export interface RingProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

export function Ring({ size = 16, className, ...props }: RingProps) {
  return (
    <svg
      role="status"
      aria-label="Loading"
      className={cn("animate-spin text-signal shrink-0", className)}
      style={{ width: size, height: size }}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle
        cx="8"
        cy="8"
        r="6"
        stroke="currentColor"
        strokeOpacity="0.18"
        strokeWidth="1.5"
      />
      <path
        d="M14 8a6 6 0 00-6-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default Ring;
