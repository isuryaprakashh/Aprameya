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
                "clean-card relative overflow-hidden rounded-lg transition-colors duration-fast",
                "bg-transparent border border-border",
                "hover:border-border-strong hover:bg-surface shadow-none",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

// --- OPERATIVE CARD ---
interface OperativeCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
    image?: string;
    name?: string;
    role?: string;
    clearance?: string;
}

export const OperativeCard = ({ className, children, image, name, role, clearance, ...props }: OperativeCardProps) => {
    return (
        <div
            className={cn(
                "w-full rounded-lg transition-colors duration-fast",
                "bg-transparent border border-border p-6",
                "hover:border-border-strong hover:bg-surface shadow-none",
                className
            )}
            {...props}
        >
            {image && (
                <div className="h-44 w-full rounded-md overflow-hidden mb-4 border border-border">
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-base"
                    />
                </div>
            )}

            <div className="relative">
                {name && <h3 className="text-base font-medium text-text mb-1">{name}</h3>}
                {role && <p className="text-xs text-text-3 font-mono uppercase tracking-wider mb-3">{role}</p>}

                {(clearance || children) && (
                    <div className="space-y-2 border-t border-border pt-3">
                        {clearance && (
                            <div className="flex justify-between text-[11px] text-text-3 font-mono">
                                <span>STATUS</span>
                                <span className="text-text">{clearance}</span>
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
                "backdrop-blur-md transition-colors duration-fast",
                "bg-surface/80 border border-border rounded-lg shadow-none",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};
