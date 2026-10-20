import React, { useRef } from 'react';
import { cn } from '@/lib/utils';

interface StripProps {
  items?: string[];
  className?: string;
}

const DEFAULT_ITEMS = [
  "National Autonomous Challenge Finalist",
  "NVIDIA Inception Program",
  "PX4 Autopilot Contributor",
  "ROS 2 Open Source Nodes",
  "SAE India Autonomy Chapter",
  "KL University Innovation Grant",
  "Edge AI Embedded Vision Benchmark",
  "Drive-by-Wire Testbed Platform",
];

export const Strip: React.FC<StripProps> = ({ items = DEFAULT_ITEMS, className }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className={cn("w-full py-4 border-y border-hairline overflow-hidden select-none bg-ink", className)}>
      <div
        ref={scrollRef}
        className="flex items-center gap-10 overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing px-6"
      >
        {items.concat(items).map((item, idx) => (
          <div key={idx} className="shrink-0 flex items-center gap-8 text-[13px] font-sans text-mute">
            <span className="w-1.5 h-1.5 rounded-full bg-signal/60 shrink-0" />
            <span className="whitespace-nowrap font-normal">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Strip;
