import React from 'react';
import { cn } from '@/lib/utils';

interface InputCleanProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export const InputClean = React.forwardRef<HTMLInputElement, InputCleanProps>(
    ({ className, label, id, ...props }, ref) => {
        const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

        return (
            <div className="input-group relative w-full">
                <input
                    ref={ref}
                    id={inputId}
                    className={cn(
                        "input-clean peer w-full bg-transparent border-b border-[var(--border-color)]",
                        "text-[var(--text-primary)] py-3 font-mono text-sm transition-colors duration-300",
                        "focus:outline-none focus:border-[hsl(var(--accent))]",
                        "placeholder-transparent",
                        className
                    )}
                    placeholder=" "
                    {...props}
                />
                <label
                    htmlFor={inputId}
                    className={cn(
                        "input-label absolute left-0 top-3 text-[var(--text-secondary)] text-sm pointer-events-none transition-all duration-300",
                        "peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-[hsl(var(--accent))]",
                        "peer-not-placeholder-shown:-translate-y-5 peer-not-placeholder-shown:scale-75 peer-not-placeholder-shown:text-[hsl(var(--accent))]"
                    )}
                >
                    {label}
                </label>
            </div>
        );
    }
);

InputClean.displayName = "InputClean";
