import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PointCloudProps {
  className?: string;
  onResolved?: () => void;
  detectedLabel?: string;
  detectedConfidence?: string;
}

interface Point {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  targetX: number;
  targetY: number;
  size: number;
  opacity: number;
  isSignal: boolean;
  vx: number;
  vy: number;
  noiseOffset: number;
}

export const PointCloud: React.FC<PointCloudProps> = ({
  className,
  onResolved,
  detectedLabel = "vehicle",
  detectedConfidence = "0.98",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [resolved, setResolved] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setResolved(true);
      onResolved?.();
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    let width = 0;
    let height = 0;

    const pointer = {
      x: -1000,
      y: -1000,
      active: false,
      angle: 0,
    };

    // Generate ~1200 points forming the car contour and structural LiDAR points
    const points: Point[] = [];
    const totalPoints = 900;

    const resize = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Initialize points
    const centerX = width / 2;
    const centerY = height / 2;
    const carWidth = Math.min(width * 0.75, 420);
    const carHeight = carWidth * 0.44;

    for (let i = 0; i < totalPoints; i++) {
      // Shape parameter t: parametric car silhouette outline + ground plane + radar lines
      let tx = centerX;
      let ty = centerY;
      let isSignal = false;

      const r = Math.random();
      if (r < 0.25) {
        // Upper roof & windshield curve
        const u = (Math.random() - 0.5) * 2;
        tx = centerX + u * (carWidth * 0.3);
        ty = centerY - carHeight * 0.42 + Math.abs(u) * (carHeight * 0.2);
        isSignal = Math.random() < 0.3;
      } else if (r < 0.65) {
        // Main chassis body & hood
        const u = (Math.random() - 0.5) * 2;
        tx = centerX + u * (carWidth * 0.48);
        ty = centerY + (Math.random() - 0.2) * (carHeight * 0.35);
        if (Math.abs(u) > 0.4) isSignal = Math.random() < 0.25;
      } else if (r < 0.85) {
        // Wheels & ground contact
        const side = Math.random() < 0.5 ? -1 : 1;
        const wheelCenterX = centerX + side * (carWidth * 0.32);
        const wheelCenterY = centerY + carHeight * 0.3;
        const angle = Math.random() * Math.PI * 2;
        const rad = Math.random() * (carHeight * 0.22);
        tx = wheelCenterX + Math.cos(angle) * rad;
        ty = wheelCenterY + Math.sin(angle) * rad;
        isSignal = Math.random() < 0.2;
      } else {
        // Ground plane LiDAR reflection points
        const u = (Math.random() - 0.5) * 2;
        tx = centerX + u * (carWidth * 0.6);
        ty = centerY + carHeight * 0.45 + Math.random() * 12;
      }

      // Random starting position for resolve choreography (t=0 to 700ms)
      const startX = centerX + (Math.random() - 0.5) * width * 1.1;
      const startY = centerY + (Math.random() - 0.5) * height * 1.1;

      points.push({
        x: startX,
        y: startY,
        baseX: tx,
        baseY: ty,
        targetX: tx,
        targetY: ty,
        size: Math.random() * 1.2 + 1.2,
        opacity: Math.random() * 0.45 + 0.35,
        isSignal,
        vx: 0,
        vy: 0,
        noiseOffset: Math.random() * 100,
      });
    }

    const startTime = performance.now();
    let resolveTriggered = false;

    const render = (now: number) => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const elapsed = now - startTime;
      const resolveProgress = Math.min(elapsed / 700, 1);
      // Ease out cubic
      const easedResolve = 1 - Math.pow(1 - resolveProgress, 3);

      if (resolveProgress >= 1 && !resolveTriggered) {
        resolveTriggered = true;
        setResolved(true);
        onResolved?.();
      }

      // Draw faint sensor sweep line if pointer is active
      if (pointer.active && resolveProgress > 0.6) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        const sweepLength = Math.max(width, height);
        ctx.lineTo(
          centerX + Math.cos(pointer.angle) * sweepLength,
          centerY + Math.sin(pointer.angle) * sweepLength
        );
        ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      }

      // Draw and update points
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      const baseColor = isDark ? "255, 255, 255" : "0, 0, 0";
      const signalColor = isDark ? "232, 38, 30" : "212, 30, 23";

      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        // Position resolve animation
        const currentTargetX = p.baseX;
        const currentTargetY = p.baseY;

        // Subtle idle breathing motion (±1px over 6s)
        const breathe = Math.sin((now * 0.001) + p.noiseOffset) * 0.8;

        let destX = p.x + (currentTargetX - p.x) * (easedResolve * 0.15);
        let destY = p.y + (currentTargetY - p.y) * (easedResolve * 0.15) + breathe;

        // Sensor cursor displacement field (140px radius)
        if (pointer.active && resolveProgress > 0.5) {
          const dx = destX - pointer.x;
          const dy = destY - pointer.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const radius = 140;

          if (dist < radius && dist > 0) {
            const force = (1 - dist / radius) * 26;
            destX += (dx / dist) * force;
            destY += (dy / dist) * force;
          }
        }

        p.x = destX;
        p.y = destY;

        // Draw dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        if (p.isSignal) {
          ctx.fillStyle = `rgba(${signalColor}, ${p.opacity * 0.85})`;
        } else {
          ctx.fillStyle = `rgba(${baseColor}, ${p.opacity * (0.4 + easedResolve * 0.4)})`;
        }
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    // Pointer events on container
    const container = containerRef.current;
    const handlePointerMove = (e: PointerEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
      pointer.angle = Math.atan2(pointer.y - centerY, pointer.x - centerX);
    };

    const handlePointerLeave = () => {
      pointer.active = false;
      pointer.x = -1000;
      pointer.y = -1000;
    };

    container?.addEventListener('pointermove', handlePointerMove, { passive: true });
    container?.addEventListener('pointerleave', handlePointerLeave);

    // Pause animation when tab or element is hidden
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting && !document.hidden;
    });
    if (container) observer.observe(container);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
      container?.removeEventListener('pointermove', handlePointerMove);
      container?.removeEventListener('pointerleave', handlePointerLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer.disconnect();
    };
  }, [prefersReducedMotion, onResolved]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-[4/3] lg:aspect-[1.25/1] rounded-[var(--r-4)] border border-hairline bg-surface-1 overflow-hidden select-none ${className || ''}`}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Grid watermark lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Signature Detection overlay framing the vehicle center */}
      <AnimatePresence>
        {resolved && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.2, 0.9, 0.2, 1.1] }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[72%] h-[56%] pointer-events-none"
          >
            {/* 1px Signal frame */}
            <div className="absolute inset-0 border border-signal rounded-[var(--r-1)]" />

            {/* Corner ticks (2px thick, 8px long) */}
            <span className="absolute -top-[1px] -left-[1px] w-[8px] h-[2px] bg-signal" />
            <span className="absolute -top-[1px] -left-[1px] w-[2px] h-[8px] bg-signal" />
            <span className="absolute -top-[1px] -right-[1px] w-[8px] h-[2px] bg-signal" />
            <span className="absolute -top-[1px] -right-[1px] w-[2px] h-[8px] bg-signal" />
            <span className="absolute -bottom-[1px] -left-[1px] w-[8px] h-[2px] bg-signal" />
            <span className="absolute -bottom-[1px] -left-[1px] w-[2px] h-[8px] bg-signal" />
            <span className="absolute -bottom-[1px] -right-[1px] w-[8px] h-[2px] bg-signal" />
            <span className="absolute -bottom-[1px] -right-[1px] w-[2px] h-[8px] bg-signal" />

            {/* Mono label outside at top-left */}
            <motion.div
              initial={{ opacity: 0, y: 2 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.12 }}
              className="absolute -top-6 left-0 px-1.5 py-0.5 rounded-[var(--r-1)] text-[11px] font-mono tracking-tight text-signal-text bg-ink border border-hairline flex items-center gap-1.5"
            >
              <span>{detectedLabel}</span>
              <span className="text-paper/90 font-normal">{detectedConfidence}</span>
            </motion.div>

            {/* Coordinates label bottom-right */}
            <div className="absolute -bottom-6 right-0 text-[10px] font-mono text-mute tracking-tight">
              32.4 FPS · 900 PTS
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PointCloud;
