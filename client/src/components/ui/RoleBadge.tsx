import React from 'react';
import { cn } from '@/lib/utils';

export type RoleType = 'aspirant' | 'core' | 'admin' | string;

interface RoleBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  role?: RoleType;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role = 'aspirant', className, ...props }) => {
  const normalized = role?.toLowerCase() || 'aspirant';

  let roleClass = 'bg-transparent text-text-2 border border-border';
  let label = 'Aspirant';

  if (normalized.includes('admin')) {
    roleClass = 'bg-invert-bg text-invert-text border-transparent';
    label = 'Admin';
  } else if (normalized.includes('core')) {
    roleClass = 'bg-red-soft text-red-text border border-red-line';
    label = 'Core';
  }

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center h-[22px] px-2.5 rounded-full font-mono text-[11px] font-medium uppercase tracking-[0.06em]',
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
