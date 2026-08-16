import React from 'react';
import { cn } from '@/lib/utils';
import AprameyaLoader from '../AprameyaLoader';

export interface ChamferedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'command';
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
    // Sizing maps
    const sizeClasses = {
      sm: 'h-8 px-3 text-[13px] gap-1.5',
      md: 'h-11 px-5 text-[15px] gap-2',
      lg: 'h-[52px] px-7 text-[16px] gap-2.5',
    }[size];

    // Variant maps
    const variantClasses = {
      primary:
        'bg-[hsl(var(--accent))] text-black font-semibold hover:brightness-110 active:brightness-95 shadow-[0_0_20px_rgba(var(--accent-rgb),0.25)] clip-chamfer',
      secondary:
        'bg-transparent border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[hsl(var(--accent))]/60 hover:bg-[hsl(var(--accent))]/5 active:brightness-95 clip-chamfer',
      ghost:
        'bg-transparent text-[var(--text-primary)] hover:underline underline-offset-4 active:opacity-80',
      destructive:
        'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 active:brightness-95 clip-chamfer',
      command:
        'bg-[var(--bg-body)] border border-[var(--border-color)] text-[var(--text-primary)] font-mono text-xs tracking-wider uppercase hover:border-[hsl(var(--accent))] rounded-none',
    }[variant];

    const isCommand = variant === 'command';

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'relative inline-flex items-center justify-center select-none font-sans font-medium transition-all duration-150',
          'active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent))] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-body)]',
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
            <span className={isCommand ? 'font-mono' : ''}>{children}</span>
            {rightIcon && <span className="shrink-0 flex items-center">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

ChamferedButton.displayName = 'ChamferedButton';

export default ChamferedButton;
