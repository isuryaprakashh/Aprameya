import { motion } from 'framer-motion';

interface AprameyaLoaderProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export default function AprameyaLoader({
  size = 32,
  className = '',
  showText = false,
}: AprameyaLoaderProps) {
  // Inline/small button loader
  if (size < 36) {
    return (
      <div
        className={`relative inline-flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
        role="status"
        aria-label="Loading"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          className="w-full h-full rounded-full border-2 border-red-500/20 border-t-red-500"
        />
        <div className="absolute w-2/3 h-2/3 rounded-full overflow-hidden p-0.5 flex items-center justify-center">
          <img src="/logo-white.png" alt="" className="w-full h-full object-contain opacity-90" />
        </div>
      </div>
    );
  }

  // Medium / Page Section Loader
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 py-8 select-none ${className}`}
      role="status"
      aria-label="Loading"
    >
      <div className="relative flex items-center justify-center" style={{ width: size * 1.8, height: size * 1.8 }}>
        {/* Outer Rotating Radar Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
          className="absolute inset-0 rounded-full border border-dashed border-red-500/40"
        />

        {/* Counter-Rotating Concentric Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 5, ease: 'linear' }}
          className="absolute inset-2 rounded-full border border-dotted border-white/20"
        />

        {/* Center Logo Frame */}
        <div
          className="relative rounded-xl bg-[#0A0A0A] border border-red-500/30 flex items-center justify-center shadow-[0_0_25px_-4px_rgba(239,68,68,0.4)] overflow-hidden"
          style={{ width: size * 1.1, height: size * 1.1 }}
        >
          {/* Laser Scanline */}
          <motion.div
            animate={{ y: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            className="absolute left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-red-400 to-transparent shadow-[0_0_6px_#EF4444]"
          />
          <img
            src="/logo-white.png"
            alt="Aprameya"
            className="w-4/5 h-4/5 object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
          />
        </div>
      </div>

      <div className="text-center space-y-1">
        <p className="font-display font-bold text-sm tracking-[0.2em] text-white">
          APRAMEYA
        </p>
        <p className="font-mono text-[10px] tracking-[0.2em] text-red-500 uppercase font-semibold">
          AI & Autonomous Systems
        </p>
        {showText && (
          <p className="font-mono text-[10px] text-zinc-500 animate-pulse">
            Processing telemetry...
          </p>
        )}
      </div>
    </div>
  );
}
