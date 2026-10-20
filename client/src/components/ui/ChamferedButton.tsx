import React from 'react';
import { Button, ButtonProps } from './button';

export interface ChamferedButtonProps
  extends Omit<ButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'danger' | 'inverse' | 'default' | 'outline' | 'link' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * @deprecated Folded into Button per DESIGN.md §7.1.1 and §15.8.
 * Forwards to unified Button primitive with §2 Perception tokens.
 */
export const ChamferedButton = React.forwardRef<HTMLButtonElement, ChamferedButtonProps>(
  ({ isLoading, loading, leftIcon, rightIcon, children, ...props }, ref) => {
    return (
      <Button ref={ref} loading={isLoading || loading} {...props}>
        {leftIcon && <span className="shrink-0">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </Button>
    );
  }
);

ChamferedButton.displayName = 'ChamferedButton';

export default ChamferedButton;
