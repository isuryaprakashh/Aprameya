import React from 'react';
import { cn } from '@/lib/utils';

export type StatusVariant =
  | 'open'
  | 'live'
  | 'accepted'
  | 'upcoming'
  | 'pending'
  | 'in review'
  | 'closed'
  | 'past'
  | 'draft'
  | 'rejected'
  | 'error'
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
  const norm = status?.toLowerCase() || '';

  let containerClass = 'bg-info-soft text-text-3';
  let dotClass = 'bg-text-3';
  let displayLabel = label || status;

  if (['open', 'live', 'accepted', 'active', 'published'].some((k) => norm.includes(k))) {
    containerClass = 'bg-success-soft text-success';
    dotClass = 'bg-success';
  } else if (['upcoming', 'pending', 'in review', 'reviewing', 'shortlisted'].some((k) => norm.includes(k))) {
    containerClass = 'bg-warning-soft text-warning';
    dotClass = 'bg-warning';
  } else if (['rejected', 'error', 'declined', 'failed'].some((k) => norm.includes(k))) {
    containerClass = 'bg-red-soft text-red-text';
    dotClass = 'bg-red-text';
  } else {
    // closed, past, draft, archived
    containerClass = 'bg-info-soft text-text-3';
    dotClass = 'bg-text-3';
  }

  const shouldPulse = isLive || norm === 'live';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 h-[22px] px-2 rounded-sm font-mono text-[11px] font-medium uppercase tracking-[0.06em]',
        containerClass,
        className
      )}
      {...props}
    >
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full shrink-0',
          dotClass,
          shouldPulse && 'animate-live-pulse'
        )}
      />
      <span>{displayLabel}</span>
    </span>
  );
};

export default StatusBadge;
