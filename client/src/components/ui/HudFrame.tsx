import React from 'react';

interface HudFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  label?: string;
  status?: string;
  interactive?: boolean;
}

export default function HudFrame({
  children,
  className = '',
  label,
  status,
  interactive = false,
  ...props
}: HudFrameProps) {
  return (
    <div
      className={`hud-card machined-panel rounded-2xl relative transition-all duration-300 ${
        interactive ? 'hover:border-[hsl(var(--accent))]/40 hover:shadow-[0_0_25px_rgba(var(--accent-rgb),0.12)]' : ''
      } ${className}`}
      {...props}
    >
      {(label || status) && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border-color)] text-[10px] font-mono text-[var(--text-secondary)] tracking-widest uppercase select-none">
          <span>{label || 'TELEMETRY // READY'}</span>
          {status && <span className="text-[hsl(var(--accent))] flex items-center gap-1.5">{status}</span>}
        </div>
      )}
      {children}
    </div>
  );
}
