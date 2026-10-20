import React, { useEffect, useRef, useState } from 'react';
import { StatItem } from '../lib/types';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  stats: StatItem[];
  className?: string;
}

// Number ticker component that runs on view entry
export const NumberTicker: React.FC<{ value: string | number; className?: string }> = ({
  value,
  className,
}) => {
  const [displayValue, setDisplayValue] = useState<string | number>(() => {
    // If not purely numeric, show right away
    const num = parseFloat(String(value).replace(/[^0-9.]/g, ''));
    return isNaN(num) ? value : 0;
  });
  const ref = useRef<HTMLSpanElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const rawStr = String(value);
    const numericMatch = rawStr.match(/([0-9.]+)/);
    if (!numericMatch) {
      setDisplayValue(value);
      return;
    }

    const targetNum = parseFloat(numericMatch[1]);
    const prefix = rawStr.slice(0, numericMatch.index);
    const suffix = rawStr.slice((numericMatch.index || 0) + numericMatch[1].length);

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          const duration = 600; // 600ms per DESIGN.md §6.13
          const start = performance.now();

          const step = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out curve
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * targetNum);
            setDisplayValue(`${prefix}${current}${suffix}`);

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setDisplayValue(value);
            }
          };

          requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {displayValue}
    </span>
  );
};

export const StatsCard: React.FC<StatsCardProps> = ({ stats, className }) => {
  return (
    <div className={cn("w-full py-8 border-y border-hairline", className)}>
      <div className="max-w-container mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-hairline text-center">
          {stats.map((stat, index) => (
            <div key={index} className="py-4 md:py-0 px-4 flex flex-col items-center justify-center">
              <div className="text-[clamp(28px,4vw,56px)] font-light leading-none mb-1 font-mono text-paper">
                <NumberTicker value={stat.value} />
              </div>
              <p className="text-[14px] text-mute font-sans font-normal leading-normal">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
