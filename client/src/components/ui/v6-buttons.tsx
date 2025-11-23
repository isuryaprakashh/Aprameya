import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

// --- BUTTON PRIMARY ---
interface ButtonPrimaryProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export const ButtonPrimary = ({ className, children, ...props }: ButtonPrimaryProps) => {
    return (
        <button
            className={cn(
                "btn-primary relative overflow-hidden transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
                "bg-[var(--text-primary)] text-[var(--bg-body)] font-semibold rounded-lg",
                "hover:opacity-90",
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};

// --- BUTTON SECONDARY ---
interface ButtonSecondaryProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export const ButtonSecondary = ({ className, children, ...props }: ButtonSecondaryProps) => {
    return (
        <button
            className={cn(
                "btn-secondary transition-all duration-300 ease-out",
                "bg-[var(--btn-bg)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-lg",
                "hover:bg-[var(--btn-bg-hover)] hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]",
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};

// --- BUTTON TRACE ---
interface ButtonTraceProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export const ButtonTrace = ({ className, children, ...props }: ButtonTraceProps) => {
    return (
        <button
            className={cn(
                "btn-trace relative overflow-visible transition-all duration-300",
                "bg-[var(--btn-bg)] text-[hsl(var(--accent))] border border-transparent",
                "hover:bg-[var(--btn-bg-hover)] hover:text-[var(--text-primary)]",
                className
            )}
            {...props}
        >
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    rx="8"
                    fill="none"
                    stroke="hsl(var(--accent))"
                    strokeWidth="2"
                    strokeDasharray="50 350"
                    strokeDashoffset="0"
                    className="animate-[traceRun_3s_linear_infinite]"
                />
            </svg>
            <span className="relative z-10">{children}</span>
        </button>
    );
};

// --- BUTTON HOLD ---
interface ButtonHoldProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    onComplete?: () => void;
    holdDuration?: number;
    completeText?: string;
}

export const ButtonHold = ({
    className,
    children,
    onComplete,
    holdDuration = 1000,
    completeText = "COMPLETE",
    ...props
}: ButtonHoldProps) => {
    const [isHeld, setIsHeld] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const startHold = () => {
        if (isComplete) return;
        setIsHeld(true);
        timerRef.current = setTimeout(() => {
            setIsComplete(true);
            setIsHeld(false);
            if (onComplete) onComplete();
        }, holdDuration);
    };

    const endHold = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setIsHeld(false);
    };

    return (
        <button
            className={cn(
                "btn-hold relative overflow-hidden select-none transition-all",
                "bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--border-color)]",
                isComplete && "activated border-[hsl(var(--accent))] text-[var(--text-primary)] bg-[var(--btn-bg-hover)]",
                className
            )}
            onMouseDown={startHold}
            onMouseUp={endHold}
            onMouseLeave={endHold}
            onTouchStart={startHold}
            onTouchEnd={endHold}
            {...props}
        >
            <div
                className={cn(
                    "progress-fill absolute top-0 left-0 h-full bg-[hsl(var(--accent))] opacity-20 transition-[width] duration-100 ease-linear",
                    isHeld ? `w-full transition-[width] duration-[${holdDuration}ms] opacity-100` : "w-0",
                    isComplete && "w-full opacity-10"
                )}
                style={{ transitionDuration: isHeld ? `${holdDuration}ms` : '100ms' }}
            />
            <span className="relative z-10 label-text">
                {isComplete ? completeText : children}
            </span>
        </button>
    );
};

// --- BUTTON SCRAMBLE ---
interface ButtonScrambleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: string;
    scrambleSpeed?: number;
}

export const ButtonScramble = ({
    className,
    children,
    scrambleSpeed = 30,
    ...props
}: ButtonScrambleProps) => {
    const [text, setText] = useState(children);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const scramble = () => {
        let iterations = 0;
        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            setText(prev =>
                children.split('').map((letter, index) => {
                    if (index < iterations) return children[index];
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join('')
            );

            if (iterations >= children.length) {
                if (intervalRef.current) clearInterval(intervalRef.current);
            }
            iterations += 1 / 2;
        }, scrambleSpeed);
    };

    return (
        <button
            className={cn(
                "btn-scramble font-mono tracking-tighter",
                "bg-[var(--btn-bg)] border border-[var(--border-color)] text-[var(--text-primary)]",
                "hover:border-[hsl(var(--accent))] hover:bg-[var(--btn-bg-hover)]",
                className
            )}
            onMouseEnter={scramble}
            {...props}
        >
            {text}
        </button>
    );
};

// --- BUTTON PRISM ---
interface ButtonPrismProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    icon?: LucideIcon;
}

export const ButtonPrism = ({ className, children, icon: Icon, ...props }: ButtonPrismProps) => {
    return (
        <button
            className={cn(
                "btn-prism backdrop-blur-md transition-all duration-300 ease-out",
                "bg-[var(--glass-panel)] border border-[var(--border-color)] text-[var(--text-primary)]",
                "hover:-translate-y-0.5 hover:scale-[1.02] hover:border-[hsl(var(--accent))] hover:shadow-lg",
                className
            )}
            {...props}
        >
            <div className="flex items-center justify-center gap-2">
                {Icon && <Icon className="w-4 h-4" />}
                <span>{children}</span>
            </div>
        </button>
    );
};

// --- BUTTON SONAR ---
interface ButtonSonarProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export const ButtonSonar = ({ className, children, ...props }: ButtonSonarProps) => {
    return (
        <button
            className={cn(
                "btn-sonar relative overflow-visible group",
                "bg-transparent border border-[hsl(var(--accent))] text-[hsl(var(--accent))]",
                "hover:bg-[hsl(var(--accent))] hover:text-[var(--bg-body)]",
                className
            )}
            {...props}
        >
            <span className="absolute inset-0 border border-[hsl(var(--accent))] rounded-lg opacity-0 group-hover:animate-[sonar_1.5s_infinite]" />
            <span className="absolute inset-0 border border-[hsl(var(--accent))] rounded-lg opacity-0 group-hover:animate-[sonar_1.5s_infinite_0.4s]" />
            <span className="relative z-10">{children}</span>
        </button>
    );
};

// --- BUTTON SCAN ---
interface ButtonScanProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export const ButtonScan = ({ className, children, ...props }: ButtonScanProps) => {
    return (
        <button
            className={cn(
                "btn-scan relative overflow-hidden transition-colors duration-300 group",
                "bg-transparent border border-[var(--border-color)] text-[var(--text-secondary)]",
                "hover:text-[var(--text-primary)] hover:border-[var(--text-primary)]",
                className
            )}
            {...props}
        >
            <span className="scan-line absolute top-0 left-0 w-0.5 h-full bg-[hsl(var(--accent))] -translate-x-full transition-transform duration-0 group-hover:translate-x-[200px] group-hover:duration-600 group-hover:ease-in-out" />
            {children}
        </button>
    );
};
