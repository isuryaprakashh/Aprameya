import React from 'react';
import { Ring } from '@/components/ui/ring';
import { cn } from '@/lib/utils';

interface AprameyaLoaderProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export default function AprameyaLoader({
  size = 16,
  className = '',
  showText = false,
}: AprameyaLoaderProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('inline-flex items-center justify-center gap-2', className)}
    >
      <Ring size={Math.min(size, 24)} />
      {showText && <span className="text-[13px] text-mute font-sans">Loading...</span>}
    </div>
  );
}
