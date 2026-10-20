import React from 'react';
import { cn } from '@/lib/utils';

export type RoleType = 'aspirant' | 'core' | 'admin' | string;

interface RoleBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  role?: RoleType;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role = 'aspirant', className, ...props }) => {
  const normalized = (role || 'aspirant').toLowerCase();

  let roleClass = 'bg-transparent text-text-2 border border-hairline-2';
  let label = 'Aspirant';

  if (normalized.includes('admin')) {
    roleClass = 'bg-invert-bg text-invert-text border-transparent';
    label = 'Admin';
  } else if (normalized.includes('core')) {
    roleClass = 'bg-signal-soft text-signal-text border border-signal-line';
    label = 'Core';
  }

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center h-[24px] px-2.5 rounded-[var(--r-full)] font-sans text-[12px] font-medium leading-none select-none',
        roleClass,
        className
      )}
      {...props}
    >
      {label}
    </span>
  );
};

export default RoleBadge;
