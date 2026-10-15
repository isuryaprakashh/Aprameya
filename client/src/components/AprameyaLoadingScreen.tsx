import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MorphingInfinity } from './MorphingInfinity';
import { Ring } from './ring';

interface AprameyaLoadingScreenProps {
  fullScreen?: boolean;
  minDuration?: number; // Minimum display time in ms (default 3000ms as requested)
  message?: string;
  onComplete?: () => void;
}

const PHASES = [
  { threshold: 0, text: 'BOOTING CORE KERNEL // SENSOR FUSION PIPELINES' },
  { threshold: 25, text: 'INITIALIZING ROS 2 STACK & SPATIAL SLAM MAPPING' },
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
    const intervalTime = 30;

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
        }, 350);
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
          : 'w-full py-16 bg-black/95 rounded-2xl border border-white/[0.08]'
      }`}
    >
      {/* Ambient background aerospace grid & radial illumination */}
      <div className="absolute inset-0 bg-[radial-gradient(#222222_1px,transparent_1px)] [background-size:24px_24px] opacity-35 pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-red-600/10 blur-[140px] pointer-events-none" />

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
            <span>CORE_BUS: CAN 2.0B // ROS 2 HUMBLE</span>
          </div>
          <div className="absolute bottom-6 right-6 font-mono text-[10px] text-zinc-600 tracking-wider hidden sm:block">
            <span>STATUS: INITIALIZING // 158.4 MHz</span>
          </div>
        </>
      )}

      {/* Main Center Stage */}
      <div className="relative z-10 flex flex-col items-center px-6 max-w-lg w-full text-center">
        {/* Prominent Authentic Aprameya Logo */}
        <div className="relative flex items-center justify-center mb-6 w-full">
          {/* Subtle ambient aura behind logo */}
          <div className="absolute w-72 h-36 bg-gradient-to-r from-red-600/20 via-red-500/10 to-red-600/20 blur-2xl rounded-full pointer-events-none" />

          {/* Large Logo with breathing animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{
              opacity: [0.9, 1, 0.9],
              scale: [0.98, 1.02, 0.98],
            }}
            transition={{
              opacity: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
              scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
            }}
            className="relative flex items-center justify-center"
          >
            <img
              src="/logo-white.png"
              alt="Aprameya AI and Autonomous Systems"
              className="w-72 sm:w-88 md:w-[380px] max-w-full h-auto object-contain filter drop-shadow-[0_0_24px_rgba(239,68,68,0.45)] drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
            />
          </motion.div>
        </div>

        {/* Club Title & Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="space-y-1.5 mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-[0.28em] text-white font-display">
            APRAMEYA
          </h1>
          <p className="font-mono text-xs sm:text-sm font-semibold tracking-[0.25em] text-red-500 uppercase">
            AI AND AUTONOMOUS SYSTEMS
          </p>
          <p className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase">
            Robotics & Intelligent Mobility Lab
          </p>
        </motion.div>

        {/* Morphing Infinity & Ring Loading Indicator */}
        <div className="relative flex items-center justify-center w-20 h-20 mb-6">
          {/* Outer Ring from @loading-ui/ring */}
          <Ring className="w-20 h-20 text-red-500/30 animate-spin" />

          {/* Morphing Infinity SVG at the center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <MorphingInfinity className="w-10 h-10 text-red-500 filter drop-shadow-[0_0_10px_rgba(239,68,68,0.75)]" />
          </div>
        </div>

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
          initial={{ opacity: 0, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-[10px] sm:text-[11px] text-zinc-400 tracking-wider truncate w-full"
        >
          {currentPhase}
        </motion.p>
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
