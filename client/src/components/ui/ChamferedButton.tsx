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
        'bg-gradient-to-b from-[#4ADE80] via-[#10B981] to-[#047857] border-t border-[#A7F3D0]/80 border-x-emerald-500/40 border-b-emerald-950 text-[#022c14] font-bold shadow-[0_4px_20px_rgba(16,185,129,0.38),inset_0_1px_1px_rgba(255,255,255,0.6)] hover:from-[#6EE7B7] hover:via-[#34D399] hover:to-[#059669] hover:shadow-[0_6px_25px_rgba(16,185,129,0.5),inset_0_1px_2px_rgba(255,255,255,0.8)] active:scale-[0.97] rounded-lg',
      secondary:
        'bg-[#06120A]/80 backdrop-blur-xl border border-emerald-500/25 text-[#F8FAFC] font-semibold shadow-[inset_0_1px_1px_rgba(167,243,208,0.15),0_4px_16px_rgba(0,0,0,0.6)] hover:border-emerald-400/50 hover:bg-[#0C2414]/90 hover:text-white active:scale-[0.97] rounded-lg',
      ghost:
        'bg-transparent text-[#94A3B8] hover:text-[#4ADE80] active:opacity-80',
      destructive:
        'bg-red-950/50 border border-red-800/60 text-red-400 hover:bg-red-900/50 active:brightness-95 rounded-lg',
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
