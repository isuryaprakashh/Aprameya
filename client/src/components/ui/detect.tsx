import React from "react";
import { cn } from "@/lib/utils";

export interface DetectProps extends React.HTMLAttributes<HTMLElement> {
  label?: string;
  id?: string | number;
  as?: React.ElementType;
  disabled?: boolean;
  showLabel?: boolean;
  tone?: "signal" | "warn";
  children?: React.ReactNode;
}

/**
 * Clean wrapper component without intrusive red borders per user feedback.
 */
export const Detect: React.FC<DetectProps> = ({
  as: Component = "div",
  className,
  children,
  ...props
}) => {
  return (
    <Component className={cn("relative", className)} {...props}>
      {children}
    </Component>
  );
};

export default Detect;
