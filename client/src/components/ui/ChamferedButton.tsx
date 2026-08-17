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
        'bg-gradient-to-b from-[#2A723E] to-[#1C512A] border border-[#4ADE80]/30 text-[#F8FAFC] font-semibold hover:from-[#32874A] hover:to-[#226334] shadow-[0_4px_20px_rgba(28,81,42,0.35)] active:brightness-95 rounded-lg',
      secondary:
        'bg-[#0C150F]/80 backdrop-blur-sm border border-emerald-500/20 text-[#F8FAFC] hover:border-emerald-500/40 hover:bg-[#13241A] rounded-lg',
      ghost:
        'bg-transparent text-[#94A3B8] hover:text-[#F8FAFC] active:opacity-80',
      destructive:
        'bg-red-950/40 border border-red-800/50 text-red-400 hover:bg-red-900/40 active:brightness-95 rounded-lg',
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
