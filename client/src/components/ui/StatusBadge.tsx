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
  | 'waitlist'
  | 'closed'
  | 'past'
  | 'draft'
  | 'cancelled'
  | 'archived'
  | 'rejected'
  | 'error'
  | 'expired'
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

  let containerClass = 'bg-info-soft text-mute border border-hairline';
  let dotClass = 'bg-mute';
  let displayLabel = label || status;

  if (['open', 'live', 'accepted', 'registered', 'active', 'published'].some((k) => norm.includes(k))) {
    containerClass = 'bg-ok-soft text-ok border border-ok/20';
    dotClass = 'bg-ok';
  } else if (['upcoming', 'pending', 'in review', 'reviewing', 'shortlisted', 'waitlist'].some((k) => norm.includes(k))) {
    containerClass = 'bg-warn-soft text-warn border border-warn/20';
    dotClass = 'bg-warn';
  } else if (['rejected', 'error', 'declined', 'failed', 'expired'].some((k) => norm.includes(k))) {
    containerClass = 'bg-signal-soft text-signal-text border border-signal-line';
    dotClass = 'bg-signal-text';
  } else {
    // closed, past, draft, cancelled, archived
    containerClass = 'bg-info-soft text-mute border border-hairline';
    dotClass = 'bg-mute';
  }

  const shouldPulse = isLive || norm === 'live';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 h-[24px] px-2 rounded-[var(--r-1)] font-sans text-[12px] font-medium leading-none select-none',
        containerClass,
        className
      )}
      {...props}
    >
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full shrink-0',
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
