import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ChamferedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'danger' | 'inverse';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export const ChamferedButton = React.forwardRef<HTMLButtonElement, ChamferedButtonProps>(
  (
    {
      className,
      variant = 'secondary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'h-8 px-3 text-[13px] gap-2 rounded-md',
      md: 'h-10 px-4 text-[14px] gap-2 rounded-md',
      lg: 'h-12 px-6 text-[15px] gap-2.5 rounded-md',
    }[size];

    const variantClasses = {
      primary:
        'bg-red text-white border-transparent hover:bg-red-hover active:bg-red-hover',
      inverse:
        'bg-invert-bg text-invert-text border-transparent hover:opacity-90 active:opacity-90',
      secondary:
        'bg-transparent text-text border-border-strong hover:bg-surface-2 active:bg-surface-2',
      ghost:
        'bg-transparent text-text-2 border-transparent hover:text-text hover:bg-surface-2 active:bg-surface-2',
      destructive:
        'bg-transparent text-red-text border-red-line hover:bg-red-soft active:bg-red-soft',
      danger:
        'bg-transparent text-red-text border-red-line hover:bg-red-soft active:bg-red-soft',
    }[variant];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'relative inline-flex items-center justify-center select-none font-body font-medium transition-colors duration-fast border cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
          'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
          sizeClasses,
          variantClasses,
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          <>
            {leftIcon && <span className="shrink-0 flex items-center">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="shrink-0 flex items-center">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

ChamferedButton.displayName = 'ChamferedButton';

export default ChamferedButton;
