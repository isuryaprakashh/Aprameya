import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const [flickerLabel, setFlickerLabel] = useState('page 0.12');

  useEffect(() => {
    const labels = ['page 0.12', 'route 0.08', 'target 0.00', 'null 0.04'];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % labels.length;
      setFlickerLabel(labels[idx]);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen w-full flex items-center justify-center px-6 py-24 bg-ink text-paper">
      <div className="w-full max-w-md text-center border border-hairline bg-surface-1 p-8 sm:p-12 relative">
        {/* Playful low-confidence detection frame (§6.30) */}
        <div className="inline-block relative p-6 my-4 border border-signal-line">
          {/* Corner ticks */}
          <span className="absolute -top-[1px] -left-[1px] w-2 h-2 border-t-2 border-l-2 border-signal" />
          <span className="absolute -top-[1px] -right-[1px] w-2 h-2 border-t-2 border-r-2 border-signal" />
          <span className="absolute -bottom-[1px] -left-[1px] w-2 h-2 border-b-2 border-l-2 border-signal" />
          <span className="absolute -bottom-[1px] -right-[1px] w-2 h-2 border-b-2 border-r-2 border-signal" />

          {/* Low confidence badge */}
          <span className="absolute -top-3 left-3 bg-signal text-on-signal font-mono text-[10px] px-1.5 py-0.5 tracking-wider">
            {flickerLabel}
          </span>

          <div className="font-mono text-6xl text-mute font-medium select-none">
            404
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-paper mt-4 mb-2">
          Page not found
        </h1>

        <p className="text-sm text-text-2 leading-relaxed mb-8">
          The autonomous perception engine could not resolve this route in the active map.
        </p>

        <div className="flex justify-center">
          <Link href="/">
            <Button variant="primary" size="lg">
              Back to home
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
