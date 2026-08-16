import { useEffect, useRef, useState } from 'react';

interface ScanlineDividerProps {
  className?: string;
  /** If true, uses the animated draw version; otherwise just a static 1px line */
  animated?: boolean;
}

/** A 1px accent-colored horizontal divider.
 *  When `animated`, it draws itself left-to-right on first viewport entry.
 */
export default function ScanlineDivider({ className = '', animated = true }: ScanlineDividerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!animated) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [animated]);

  if (!animated) {
    return <div className={`scanline-divider-static ${className}`} />;
  }

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      {visible && <div className="scanline-divider" />}
    </div>
  );
}
