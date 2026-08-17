import React from 'react';
import { cn } from '@/lib/utils';
import AprameyaLoader from '../AprameyaLoader';

export interface ChamferedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
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
      variant = 'primary',
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
      sm: 'h-9 px-4 text-[13px] gap-1.5',
      md: 'h-11 px-5 text-[15px] gap-2',
      lg: 'h-[52px] px-7 text-[16px] gap-2.5',
    }[size];

    const variantClasses = {
      primary:
        'bg-[#DC2626] hover:bg-[#EF4444] active:bg-[#B91C1C] text-white font-semibold border border-red-500/30 shadow-none rounded-lg transition-colors',
      secondary:
        'bg-[#111111] hover:bg-[#1A1A1A] active:bg-[#0D0D0D] text-white font-semibold border border-white/10 hover:border-white/20 shadow-none rounded-lg transition-colors',
      ghost:
        'bg-transparent text-[#94A3B8] hover:text-white active:opacity-80 transition-colors',
      destructive:
        'bg-red-950/70 border border-red-700/50 text-red-300 hover:bg-red-900 active:brightness-95 rounded-lg transition-colors',
    }[variant];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'relative inline-flex items-center justify-center select-none font-sans font-medium transition-all duration-150 cursor-pointer',
          'active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]',
          'disabled:opacity-40 disabled:pointer-events-none',
          sizeClasses,
          variantClasses,
          className
        )}
        {...props}
      >
        {isLoading ? (
          <AprameyaLoader size={size === 'sm' ? 18 : 22} />
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
