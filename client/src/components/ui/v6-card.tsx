import React from 'react';
import { cn } from '@/lib/utils';

// --- CLEAN CARD ---
interface CleanCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const CleanCard = ({ className, children, ...props }: CleanCardProps) => {
    return (
        <div
            className={cn(
                "clean-card relative overflow-hidden rounded-2xl transition-all duration-400",
                "bg-[var(--card-bg)] border border-[var(--border-color)]",
                "hover:border-[hsl(var(--accent))] hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]",
                className
            )}
            style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
            {...props}
        >
            {children}
        </div>
    );
};

// --- OPERATIVE CARD ---
interface OperativeCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    image?: string;
    name?: string;
    role?: string;
    clearance?: string;
}

export const OperativeCard = ({ className, children, image, name, role, clearance, ...props }: OperativeCardProps) => {
    return (
        <div
            className={cn(
                "operative-card w-[280px] h-[380px] shrink-0 relative overflow-hidden rounded-2xl transition-all duration-300",
                "bg-[var(--card-bg)] border border-[var(--border-color)]",
                "hover:-translate-y-2.5 hover:scale-[1.02] hover:border-[hsl(var(--accent))] hover:bg-[var(--btn-bg-hover)] hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.1)] hover:z-10",
                className
            )}
            {...props}
        >
            {image && (
                <div className="operative-img-container h-[60%] w-full relative overflow-hidden group">
                    <img
                        src={image}
                        alt={name}
                        className="operative-img w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.2)_3px)] pointer-events-none opacity-30" />
                </div>
            )}

            <div className="operative-data p-6 relative">
                <div className="operative-status-dot absolute top-6 right-6 w-2 h-2 rounded-full bg-[var(--text-secondary)] transition-colors duration-300 group-hover:bg-[hsl(var(--accent))] group-hover:shadow-[0_0_10px_hsl(var(--accent))]" />
                {name && <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">{name}</h3>}
                {role && <p className="text-xs text-[hsl(var(--accent))] font-mono mb-4">{role}</p>}

                {(clearance || children) && (
                    <div className="space-y-2 border-t border-[var(--border-color)] pt-4">
                        {clearance && (
                            <div className="flex justify-between text-[10px] text-[var(--text-secondary)] font-mono">
                                <span>CLEARANCE</span>
                                <span className="text-[var(--text-primary)]">{clearance}</span>
                            </div>
                        )}
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
};

// --- GLASS PANEL ---
interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const GlassPanel = ({ className, children, ...props }: GlassPanelProps) => {
    return (
        <div
            className={cn(
                "glass-panel backdrop-blur-xl transition-colors duration-500",
                "bg-[var(--glass-panel)] border border-[var(--border-color)]",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};
