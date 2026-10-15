import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AprameyaLoadingScreenProps {
  fullScreen?: boolean;
  minDuration?: number; // Minimum display time in ms (default 3000ms as requested)
  message?: string;
  onComplete?: () => void;
}

const PHASES = [
  { threshold: 0, text: 'BOOTING CORE KERNEL // SENSOR FUSION PIPELINE' },
  { threshold: 25, text: 'INITIALIZING ROS 2 NODES & SPATIAL SLAM' },
  { threshold: 60, text: 'CALIBRATING PERCEPTION ENGINE & EDGE TPU' },
  { threshold: 88, text: 'APRAMEYA SYSTEMS ONLINE // CLEARANCE GRANTED' },
];

export const AprameyaLoadingScreen = ({
  fullScreen = true,
  minDuration = 3000,
  message,
  onComplete,
}: AprameyaLoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const intervalTime = 30; // updates every 30ms

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min(100, Math.floor((elapsed / minDuration) * 100));

      setProgress(rawProgress);

      if (elapsed >= minDuration) {
        clearInterval(timer);
        setProgress(100);
        setTimeout(() => {
          setIsFinished(true);
          if (onComplete) onComplete();
        }, 300);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [minDuration, onComplete]);

  // Determine current telemetry text
  const currentPhase =
    message ||
    [...PHASES].reverse().find((p) => progress >= p.threshold)?.text ||
    PHASES[0].text;

  const content = (
    <div
      className={`relative flex flex-col items-center justify-center select-none overflow-hidden ${
        fullScreen
          ? 'fixed inset-0 z-[9999] bg-black text-white w-screen h-screen'
          : 'w-full py-20 bg-black/90 rounded-2xl border border-white/[0.08]'
      }`}
    >
      {/* Ambient background aerospace grid & radial illumination */}
      <div className="absolute inset-0 bg-[radial-gradient(#222222_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-red-600/10 blur-[120px] pointer-events-none" />

      {/* Futuristic Corner HUD Markers (only on fullScreen) */}
      {fullScreen && (
        <>
          <div className="absolute top-6 left-6 font-mono text-[10px] text-zinc-500 tracking-wider flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>SYS_INIT // AUTONOMY_v2</span>
          </div>
          <div className="absolute top-6 right-6 font-mono text-[10px] text-zinc-500 tracking-wider text-right">
            <span>LOC: R609e // KLU LABS</span>
          </div>
          <div className="absolute bottom-6 left-6 font-mono text-[10px] text-zinc-600 tracking-wider hidden sm:block">
            <span>CORE_BUS: CAN 2.0B / ROS2 HUMBLE</span>
          </div>
          <div className="absolute bottom-6 right-6 font-mono text-[10px] text-zinc-600 tracking-wider hidden sm:block">
            <span>FREQ: 158.4 MHz // TELEMETRY_OK</span>
          </div>
        </>
      )}

      {/* Main Center Stage */}
      <div className="relative z-10 flex flex-col items-center px-6 max-w-md w-full text-center">
        {/* Radar Enclosure with Rotating Ticks and Aprameya Logo */}
        <div className="relative w-36 h-36 md:w-44 md:h-44 flex items-center justify-center mb-8">
          {/* Outer Rotating Radar Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
            className="absolute inset-0 rounded-full border border-dashed border-red-500/30"
          />

          {/* Counter-Rotating Concentric Ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
            className="absolute inset-2 rounded-full border border-dotted border-white/20"
          />

          {/* Ambient Glowing Aura */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-red-600/20 to-transparent blur-md animate-pulse" />

          {/* Central Logo Box */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-[#0A0A0A] border border-red-500/40 p-4 flex items-center justify-center shadow-[0_0_40px_-5px_rgba(239,68,68,0.4)] overflow-hidden"
          >
            {/* High-Tech Vertical Laser Scanline */}
            <motion.div
              animate={{ y: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-400 to-transparent shadow-[0_0_8px_#EF4444]"
            />

            {/* Aprameya Emblem */}
            <img
              src="/logo-white.png"
              alt="Aprameya Emblem"
              className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]"
            />
          </motion.div>
        </div>

        {/* Brand Name & Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-1.5 mb-6"
        >
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-[0.25em] text-white font-display">
            APRAMEYA
          </h1>
          <p className="font-mono text-xs md:text-sm font-semibold tracking-[0.28em] text-red-500 uppercase">
            AI and Autonomous Systems
          </p>
          <p className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase">
            Robotics & Intelligent Mobility Lab
          </p>
        </motion.div>

        {/* Progress Bar & Numeric Counter */}
        <div className="w-full space-y-2 mb-3">
          <div className="flex justify-between items-center text-[11px] font-mono text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              SYSTEM DIAGNOSTICS
            </span>
            <span className="font-bold text-red-400">{progress}%</span>
          </div>

          {/* Progress Bar Track */}
          <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden p-[1px] border border-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-red-600 via-red-500 to-white rounded-full shadow-[0_0_10px_#EF4444]"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>
        </div>

        {/* Dynamic Telemetry Status Log */}
        <motion.p
          key={currentPhase}
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-[10px] md:text-[11px] text-zinc-400 tracking-wider truncate w-full"
        >
          {currentPhase}
        </motion.p>

        {/* Frequency / Equalizer Waves at bottom */}
        <div className="flex items-center gap-1 mt-6 h-4">
          {[40, 75, 50, 90, 60, 100, 45, 80, 55, 95, 70, 35].map((h, i) => (
            <motion.div
              key={i}
              animate={{
                scaleY: [0.3, 1, 0.4],
                backgroundColor: progress === 100 ? '#10B981' : '#EF4444',
              }}
              transition={{
                repeat: Infinity,
                duration: 0.8 + (i % 3) * 0.2,
                ease: 'easeInOut',
              }}
              className="w-1 bg-red-500 rounded-full"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );

  if (!fullScreen) {
    return content;
  }

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98, filter: 'blur(8px)' }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999]"
        >
          {content}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AprameyaLoadingScreen;
