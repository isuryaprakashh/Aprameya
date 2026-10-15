import React from 'react';
import { WanderingEyes } from './loading-ui/wandering-eyes';
import { cn } from '@/lib/utils';

interface WanderingEyesLoaderProps {
  text?: string;
  subtext?: string;
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
  className?: string;
}

export const WanderingEyesLoader: React.FC<WanderingEyesLoaderProps> = ({
  text,
  subtext,
  size = 'md',
  fullPage = false,
  className,
}) => {
  const sizeClasses = {
    sm: 'h-8 w-[72px]',
    md: 'h-12 w-[108px]',
    lg: 'h-16 w-[144px]',
  };

  const containerContent = (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center select-none text-center',
        fullPage
          ? 'min-h-[70vh] w-full py-16'
          : 'py-12 px-6 w-full',
        className
      )}
    >
      {/* Ambient background glow */}
      <div className="absolute w-48 h-24 bg-red-600/15 rounded-full blur-2xl pointer-events-none -translate-y-2" />

      {/* Wandering Eyes with Aprameya Cybernetic Aesthetic */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 shadow-[0_0_30px_-5px_rgba(239,68,68,0.35)] backdrop-blur-md mb-4 group transition-all duration-300">
          <WanderingEyes
            className={cn(
              sizeClasses[size],
              'text-red-500 [--eye-color:rgba(239,68,68,0.22)] [--pupil-color:#ef4444] transition-all'
            )}
            style={{ '--duration': '7s' } as React.CSSProperties}
          />
        </div>

        {/* Status / Telemetry Text */}
        {text && (
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping inline-block" />
              <p className="font-mono text-xs sm:text-sm font-semibold tracking-[0.2em] text-white uppercase">
                {text}
              </p>
            </div>
            {subtext && (
              <p className="font-mono text-[10px] tracking-wider text-zinc-400 uppercase">
                {subtext}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-screen bg-[var(--bg-body)] flex items-center justify-center w-full">
        {containerContent}
      </div>
    );
  }

  return containerContent;
};

export default WanderingEyesLoader;
