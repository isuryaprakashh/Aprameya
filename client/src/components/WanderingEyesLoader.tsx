import React from 'react';
import { cn } from '@/lib/utils';
import { Ring } from '@/components/ui/ring';

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
  const pixelSize = size === 'sm' ? 16 : size === 'lg' ? 24 : 18;

  return (
    <div
      role="status"
      aria-label={text || 'Loading'}
      className={cn(
        'flex flex-col items-center justify-center text-center select-none',
        fullPage ? 'min-h-[50vh] w-full py-16' : 'py-12 px-6 w-full',
        className
      )}
    >
      <Ring size={pixelSize} />
      {text && (
        <p className="mt-3 text-[13px] text-mute font-sans">
          {text.toLowerCase()}
        </p>
      )}
      {subtext && (
        <p className="mt-1 text-[11px] text-text-disabled font-sans">
          {subtext.toLowerCase()}
        </p>
      )}
    </div>
  );
};

export default WanderingEyesLoader;
