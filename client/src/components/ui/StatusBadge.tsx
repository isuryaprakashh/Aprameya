import React from 'react';
import { cn } from '@/lib/utils';

export type StatusVariant =
  | 'open'
  | 'live'
  | 'accepted'
  | 'registered'
  | 'active'
  | 'published'
  | 'upcoming'
  | 'pending'
  | 'in review'
  | 'reviewing'
  | 'waitlist'
  | 'closed'
  | 'past'
  | 'completed'
  | 'draft'
  | 'cancelled'
  | 'archived'
  | 'rejected'
  | 'error'
  | 'expired'
  | 'featured'
  | string;

interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: StatusVariant;
  label?: string;
  isLive?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  isLive = false,
  className,
  ...props
}) => {
  const norm = (status || '').toLowerCase().trim();
  const displayLabel = label || status;

  // Modern, high-contrast, theme-adaptive badge styles with backdrop blur for image legibility
  let containerClass =
    'bg-neutral-100 dark:bg-neutral-900/90 border-neutral-300 dark:border-neutral-700/80 text-neutral-800 dark:text-neutral-200';
  let dotClass = 'bg-neutral-500 dark:bg-neutral-400';

  // 1. Live / Active / Open / Registered / Accepted
  if (['open', 'live', 'accepted', 'registered', 'active', 'published'].some((k) => norm.includes(k))) {
    containerClass =
      'bg-emerald-50 dark:bg-emerald-950/85 border-emerald-300 dark:border-emerald-500/40 text-emerald-900 dark:text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.15)]';
    dotClass = 'bg-emerald-600 dark:bg-emerald-400 shadow-[0_0_6px_#10B981]';
  }
  // 2. Featured / Awards / Podium
  else if (['featured', 'national', 'podium', '1st', '2nd', '3rd', 'winner', 'award'].some((k) => norm.includes(k))) {
    containerClass =
      'bg-amber-100/90 dark:bg-amber-950/85 border-amber-400 dark:border-amber-400/50 text-amber-950 dark:text-amber-200 shadow-[0_0_12px_rgba(251,191,36,0.2)]';
    dotClass = 'bg-amber-500 shadow-[0_0_6px_#FBBF24]';
  }
  // 3. Upcoming / In Review / Pending
  else if (['upcoming', 'pending', 'in review', 'reviewing', 'shortlisted', 'waitlist'].some((k) => norm.includes(k))) {
    containerClass =
      'bg-amber-50 dark:bg-amber-950/80 border-amber-300 dark:border-amber-500/40 text-amber-900 dark:text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.15)]';
    dotClass = 'bg-amber-600 dark:bg-amber-400 shadow-[0_0_6px_#F59E0B]';
  }
  // 4. Rejected / Error / Failed
  else if (['rejected', 'error', 'declined', 'failed', 'expired'].some((k) => norm.includes(k))) {
    containerClass =
      'bg-rose-50 dark:bg-rose-950/85 border-rose-300 dark:border-rose-500/40 text-rose-900 dark:text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.15)]';
    dotClass = 'bg-rose-600 dark:bg-rose-400 shadow-[0_0_6px_#F43F5E]';
  }
  // 5. Technical Domains / Categories (Robotics, Autonomous, AI, UAS, Edge AI, Software, Hardware)
  else if (['robotics', 'autonomous', 'vehicle', 'uas', 'drone', 'ai', 'vision', 'edge', 'hardware', 'software'].some((k) => norm.includes(k))) {
    containerClass =
      'bg-sky-50 dark:bg-sky-950/85 border-sky-300 dark:border-sky-500/40 text-sky-900 dark:text-sky-300 shadow-[0_0_10px_rgba(14,165,233,0.15)]';
    dotClass = 'bg-sky-600 dark:bg-sky-400 shadow-[0_0_6px_#0EA5E9]';
  }
  // 6. Closed / Past / Archived / Completed
  else {
    containerClass =
      'bg-neutral-100/95 dark:bg-neutral-900/90 border-neutral-300 dark:border-neutral-700/80 text-neutral-800 dark:text-neutral-300';
    dotClass = 'bg-neutral-500 dark:bg-neutral-400';
  }

  const shouldPulse = isLive || norm === 'live';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 h-[24px] px-2.5 rounded-[var(--r-full)] font-sans text-[11px] font-semibold tracking-wide border backdrop-blur-md shadow-xs select-none transition-all duration-fast',
        containerClass,
        className
      )}
      {...props}
    >
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full shrink-0 transition-transform',
          dotClass,
          shouldPulse && 'animate-[live-pulse_1.6s_ease-in-out_infinite]'
        )}
        aria-hidden="true"
      />
      <span>{displayLabel}</span>
      {shouldPulse && <span className="sr-only"> (Live now)</span>}
    </span>
  );
};

export default StatusBadge;
